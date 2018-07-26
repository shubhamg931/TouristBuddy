import _ from 'lodash';
import React, {Component} from 'react';
import {Text, View, AsyncStorage} from "react-native";
import Slides from "../components/Slides";
import {AppLoading} from 'expo';

const SLIDE_DATA = [
    {text: 'Welcome to Tourist Buddy', color: '#03A9F4', image: 'logo.png'},
    {text: "Here's how to use this app", color: "#009688", image: 'rajasthan.png'},
    // {text: 'Welcome to JOB asdsadsaAPP', color: '#03A9F4'},
    {text: 'We will get you all info required to travel smoothly!', color: "#03A9F4"}
];

class WelcomeScreen extends Component{
    state = {signedIn: null};

    async componentWillMount(){
        console.log("welcome screen");
        let signedIn = AsyncStorage.getItem('signedIn');
        console.log("signedIn: " + JSON.stringify(signedIn));
        if(signedIn){
            this.props.navigation.navigate("auth");
            this.setState({signedIn});
        }else{
            this.setState({signedIn: false});
        }

    }

    onSlidesComplete = () => {
        this.props.navigation.navigate('auth');
    };

    render(){
        if(_.isNull(this.state.signedIn)){
            return <AppLoading/>;
        }
        return(
            <View style={{flex: 1}}>
                <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete}/>
            </View>
        );
    }
}

export default WelcomeScreen;