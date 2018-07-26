import React, { Component } from 'react';
import {Platform, Text, View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import {AnimatedRegion, Marker} from 'react-native-maps';
import { Constants, Location, Permissions, MapView } from 'expo';
import {connect} from 'react-redux';
import * as actions from '../actions';
import firebase from "firebase";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {ButtonRoundedExample    } from "../components/common";
import axios from "axios";
import {Body, Button, Card, CardItem, Container, Content, DatePicker, H3} from "native-base";

const {width, height} = Dimensions.get('window');
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = 0.001;

let liveLocation, receivingLiveLocation, receivedMarkers = [];
let bodyFormData = new FormData();
let mkmKaData = [];

class MapScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            marker: {
                latlng: {latitude: 28.6849, longitude: 77.1297},
                title: "initial",
                description: "Initialization successful!",
                heading: 0,
            },
            initialRegion: {
                latitude: 28.6849,
                longitude: 77.1297,
                longitudeDelta: LONGITUDE_DELTA,
                latitudeDelta: LATITUDE_DELTA
            },
            driverMarkers:[{
                latlng: {latitude: 28.6849, longitude: 77.1297},
                title: "initial",
                description: "Initialization successful!",
                heading: 0,
            }],
            startPoint: {},
            endPoint: {}
        };
    }

    componentDidMount() {

        console.log("inside mount: " + JSON.stringify(this.props.user));

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage:
                    'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
            this.watchID = Location.watchPositionAsync({
                enableHighAccuracy: true,
                distanceInterval: 1,
            }, NewLocation => {
                let coords = NewLocation.coords;
                this.setState({location: coords, marker: {
                        latlng: {
                            latitude: coords.latitude,
                            longitude: coords.longitude
                        }, title: "live aari hai", description: "shi hai!", heading: coords.heading},
                });
            });
            this.sendLiveLocation();
            this.receiveLiveLocation();
        }
    }

    sendLiveLocation = () => {
        liveLocation = setInterval(() => {
            const db = firebase.firestore();
            const settings = {timestampsInSnapshots: true};
            db.settings(settings);
            console.log("this.props.user.uid: " + JSON.stringify(this.props.user.uid));
            db.collection("drivers").doc(this.props.user.uid).update({
                currentLocation: this.state.location
            }).then(() => console.log("location sent successfully! "))
                .catch(() => console.log("unable to send location"));
        }, 10000);
    };

    receiveLiveLocation = () => {
        console.log("RECEIVING LIVE LOCATION!");
        console.log("REALTIME FETCHING STARTED!");
        const db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        db.collection("drivers")
            .onSnapshot((querySnapShots) => {
                querySnapShots.forEach((doc) => {
                    if(doc.data().currentLocation.latitude) {
                        let obj = {
                            latlng: {
                                latitude: doc.data().currentLocation.latitude,
                                longitude: doc.data().currentLocation.longitude
                            },
                            title: doc.data().name,
                            description: doc.id,
                            heading: doc.data().currentLocation.heading,
                            type: doc.data().type
                        };
                        receivedMarkers.push(obj);
                        this.state.driverMarkers = receivedMarkers;
                    }
                });
                console.log("received live location array: " + JSON.stringify(receivedMarkers));
                receivedMarkers = [];
            }, (err) => {
                console.log("Error fetching: " + err);
            });
    };

    getBestBus = () => {
        let data = {
            start_point: this.state.startPoint,
            end_point: this.state.endPoint
        };
        console.log("Data: " + JSON.stringify(data));

        axios({
            method: 'post',
            url: 'https://escale.pythonanywhere.com/stand_routing/location/',
            data: data,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
            .then(function (response) {
                mkmKaData = response;
                console.log("best bus successful!");
                console.log("MKMM KI MEHNAT:" + JSON.stringify(response));
            })
            .catch(function (response) {
                console.log("best bus UNsuccessful!");
                console.log(response);
            });
        this.state.data = mkmKaData;
        console.log("this.state.data: " + JSON.stringify(this.state.data));
    };

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps: " + JSON.stringify(this.props.user));
    }

    componentWillUnmount(){
        console.log("map component unmounted!");
        Location.remove(this.watchID);
        clearInterval(receivingLiveLocation);
    }

    watchID = null;

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("LOCAITON: " + JSON.stringify(location.coords));
        let newLat = location.coords.latitude;
        let newLng = location.coords.longitude;
        let newLatLng = {latitude: newLat, longitude: newLng};

        let newRegion = {latitude: newLat, longitude: newLng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA};
        this.state.initialRegion = newRegion;
        console.log("New latlng:" + JSON.stringify(newLatLng));
        this.setState({ location: location.coords, marker: {
                latlng: newLatLng,
                title: "changed",
                description:"current location",
                heading: location.coords.heading
            },
            initialRegion: newRegion
        });
    };

    render() {
        let text = 'Waiting..';
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            text = JSON.stringify(this.state.location);
        }

        const {marker, driverMarkers} = this.state;
        return (
            <View style={{flex: 1}}>
                <MapView
                    initialRegion={this.state.initialRegion}
                    style={{ flex: 1 }}>
                    <Marker.Animated
                        coordinate={marker.latlng}
                        ref={marker => { this.marker = marker }}
                        style={{transform: [{rotate: marker.heading === undefined ? '0deg' : `${marker.heading}deg`}]
                        }}
                        title={marker.title}
                        description={marker.description}
                        flat>
                    </Marker.Animated>
                    {this.state.driverMarkers.map(driverMarker => {
                        if(driverMarker.type === "driver") {
                            console.log("DRIVER SHOWED!!!!");
                            return (
                                <Marker.Animated
                                    key={Math.random() * 1000000000000}
                                    coordinate={driverMarker.latlng}
                                    ref={marker => {
                                        this.marker = marker
                                    }}
                                    style={{
                                        transform: [{rotate: driverMarker.heading === undefined ? '0deg' : `${driverMarker.heading}deg`}]
                                    }}
                                    title={driverMarker.title}
                                    description={driverMarker.description}
                                    flat>
                                    <Image style={{
                                        height: 25,
                                        width: 25,
                                        transform: [{
                                            rotate: '0deg'
                                        }]
                                    }}
                                           source={require('../assets/bus.png')}/>
                                </Marker.Animated>
                            )
                        }
                    })}
                </MapView>
                <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                    <Card>
                        <GooglePlacesAutocomplete
                            placeholder='Enter Location'
                            minLength={2}
                            autoFocus
                            returnKeyType={'default'}
                            fetchDetails={true}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth:0
                                },
                                textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    color: '#5d5d5d',
                                    fontSize: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                            }}
                            query={{
                                key: 'AIzaSyDwssnK53dpo_fB7JQa-2zq0M1OYU-Ebn4',
                                language: 'en',
                            }}
                            onPress={(data, details) => {
                                console.log("DATA: " + JSON.stringify(data));
                                console.log("DETAILS: " + JSON.stringify(details));
                                this.state.startPoint = [
                                    details.geometry.location.lat,
                                    details.geometry.location.lng
                                ]
                            }}
                            currentLocation={false}
                        />
                        <GooglePlacesAutocomplete
                            placeholder='Enter Destination'
                            minLength={2}
                            autoFocus
                            returnKeyType={'default'}
                            fetchDetails={true}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth:0
                                },
                                textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    color: '#5d5d5d',
                                    fontSize: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                            }}
                            query={{
                                key: 'AIzaSyDwssnK53dpo_fB7JQa-2zq0M1OYU-Ebn4',
                                language: 'en',
                            }}
                            onPress={(data, details) => {
                                console.log("DATA: " + JSON.stringify(data));
                                console.log("DETAILS: " + JSON.stringify(details));
                                this.state.endPoint = [
                                    details.geometry.location.lat,
                                    details.geometry.location.lng
                                ]
                            }}
                            currentLocation={false}/>
                        <CardItem>
                            <Button block onPress={this.getBestBus} light>
                                <Text>
                                    Get Best Buses And Routes
                                </Text>
                            </Button>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <H3>
                                Best Buses and Routes
                            </H3>
                        </CardItem>
                        <Container>
                            <Content>
                                <Card>
                                    <CardItem header>
                                        <Text>Bus name</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                        <Text>
                                            Other Bus Information
                                        </Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem footer>
                                        <Text>See More</Text>
                                    </CardItem>
                                </Card>
                            </Content>
                        </Container>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    scrollViewStyle: {
        display: "flex",
        justifyContent: "center",
    }
};

const mapStateToProps = ({auth}) => {
    console.log("mapstatetoprops:" + JSON.stringify(auth));
    return {
        user: auth.user,
        token: auth.token
    };
};

export default connect(mapStateToProps, actions)(MapScreen);