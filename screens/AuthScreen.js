import React, {Component} from 'react';
import { View, AsyncStorage} from "react-native";
import {Container, Text, Content, Form, Item, Input, Label, Button, Picker, Icon, Toast} from 'native-base';
import {connect} from 'react-redux';
import * as actions from "../actions";
import {ButtonRoundedExample, Card, CardItem, HeaderNoShadow} from "../components/common";
import firebase from 'firebase';
import 'firebase/firestore';

class AuthScreen extends Component{
    constructor(props){
        super(props)

        this.state= {
            email: '',
            password: '',
            error: [],
            selected2: "",
            user: {},
            driverName: "",
            busNumber: "",
        };
    }

    logInUser = (email, password) => {
        try {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    console.log("signed in successfully: " + JSON.stringify(user));
                    this.onAuthComplete(this.props);
                })
                .catch((err) => {
                    console.log("err: " + err);
                    this.state.error.push(err.toString());
                    this.showErrorToast();
                });
        }
        catch (e) {
            console.log("Login Error: " + e);
        }
    };

    showErrorToast = () => {
        console.log("Error in the state: " + this.state.error);
        this.state.error.forEach((error) => {
            Toast.show({
                text: error,
                buttonText: "Okay",
                type: "danger",
                duration: 3000
            });
        });
    };

    facebookLoginIn  = () => {
        console.log("facebook login called!: " + JSON.stringify(this.state));
        if(this.state.selected2 === "") {
            this.state.error.push("Select your type please!");
            return this.showErrorToast();
        }
        else if(this.state.selected2 === "driver" && (this.state.driverName === "" || this.state.busNumber === "")){
            this.state.error.push("Enter Driver Info Plese!");
            return this.showErrorToast();
        }
        this.props.facebookLogin(this.state);
    };

    signUpUser = (email, password) => {
        if(this.state.selected2 === ""){
            this.state.error.push("Select your type please!");
            console.log("check: " + this.state.error);
            this.showErrorToast();
        }else if(this.state.selected2 === "driver" && (this.state.driverName === "" || this.state.busNumber === "")){
            this.state.error.push("Enter Driver Info Plese!");
            this.showErrorToast();
        }
        else {
            try {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(async (user) => {
                        console.log("Signed up successfully: " + JSON.stringify(user));
                        await AsyncStorage.setItem("signedIn", '1');
                        const db = firebase.firestore();
                        const settings = {timestampsInSnapshots: true};
                        db.settings(settings);
                        db.collection("drivers").doc(user.user.uid).set({
                            name: user.user.displayName,
                            email: user.user.email,
                            phone: user.user.phoneNumber,
                            photoURL: user.user.photoURL,
                            loginMethod: "emailPass",
                            currentLocation: {},
                            type: this.state.selected2,
                            driverName: this.state.driverName,
                            busNumber: this.state.busNumber
                        })
                            .then(() => {
                                console.log("user successfully added to database!");
                                Toast.show({
                                    text: "Successfully Signed Up!",
                                    buttonText: "Okay",
                                    type: "success",
                                    duration: 3000
                                });
                                this.setState({
                                    email: '',
                                    password: '',
                                    error: [],
                                    selected2: "",
                                    user: {},
                                    driverName: "",
                                    busNumber: ""
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                this.state.error.push(err.toString());
                                this.showErrorToast();
                            });
                    })
                    .catch((err) => {
                        console.log("err: " + err);
                        this.state.error.push(err.toString());
                        this.showErrorToast();
                    });
            }
            catch (e) {
                console.log("sign up error:" + e);
            }
        }
    };

    renderDriverDetailForm = (status) => {
        if(status === "driver"){
            return(
                <Form style={{display: 'flex', flex: 1, width: 200}}>
                    <Item floatingLabel>
                        <Label>Driver Name</Label>
                        <Input onChangeText={(driverName) => this.setState({driverName})}/>
                    </Item>
                    < Item floatingLabel>
                        <Label>Bus Number</Label>
                        <Input onChangeText={(busNumber) => this.setState({busNumber})}/>
                    </Item>
                </Form>

            );
        }
    };

    async componentDidMount(){
        let status = await AsyncStorage.removeItem('fb_token');
        this.onAuthComplete(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.onAuthComplete(nextProps);
    }

    onAuthComplete(props){
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null){
                console.log("there is a user signed in: " + JSON.stringify(user));
                this.props.navigateToMaps(user, () => {
                    this.props.navigation.navigate("map");
                    console.log("navigated using navigate!");
                });
            }else{
                this.showErrorToast();
            }
        });
    }
    onValueChange2 = (value) => {
        this.setState({
            selected2: value
        });
    }
    render(){
        return(
            <Container>
                <HeaderNoShadow headerText="Login/SignUp" />
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input onChangeText={(email) => this.setState({email})}/>
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input onChangeText={(pass) => this.setState({password: pass})}
                            secureTextEntry/>
                        </Item>
                    </Form>
                    <Card>
                        <CardItem>
                            <Button block warning onPress={() => this.logInUser(this.state.email, this.state.password)}>
                                <Text>
                                    Login In
                                </Text>
                            </Button>
                        </CardItem>
                        <CardItem>
                            <Button block info onPress={() => this.signUpUser(this.state.email, this.state.password)}>
                                <Text>
                                    Sign Up
                                </Text>
                            </Button>
                        </CardItem>
                        <CardItem>
                            <Button block onPress={this.facebookLoginIn}>
                                <Text>
                                    Login In With Facebook
                                </Text>
                            </Button>
                        </CardItem>
                        <CardItem>
                            <Text>I am a(Specify on Sign up!): </Text>
                            <Picker
                                style={{display:'flex',flex: 1, alignSelf: 'stretch'}}
                                selectedValue={this.state.selected2}
                                onValueChange={value => this.onValueChange2(value)}
                            >
                                <Picker.Item label="User" value="user" />
                                <Picker.Item label="Driver" value="driver" />
                            </Picker>
                            {this.renderDriverDetailForm(this.state.selected2)}
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );

    }
}

const mapStateToProps = ({auth}) => {
    return {
        token: auth.token,
        user: auth.user,
        error: auth.error
    };
};

export default connect(mapStateToProps, actions)(AuthScreen);