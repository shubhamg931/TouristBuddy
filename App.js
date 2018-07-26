import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from "react-redux";
import {createBottomTabNavigator} from "react-navigation";
import WelcomeScreen from "./screens/WelcomeScreen";
import AuthScreen from "./screens/AuthScreen";
import MapScreen from "./screens/MapScreen";
import InfoScreen from "./screens/InfoScreen";
import store from "./store";
import firebase from 'firebase';
import 'firebase/firestore';
import ignoreWarnings from 'react-native-ignore-warnings';
import {Root} from "native-base";

ignoreWarnings(['Setting a timer']);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    async componentWillMount() {

        const config = {
            apiKey: "AIzaSyAcIcka1AJDAVCbG2moaq2WT3x6I2BojXA",
            authDomain: "touristbuddy-931.firebaseapp.com",
            databaseURL: "https://touristbuddy-931.firebaseio.com",
            projectId: "touristbuddy-931",
            storageBucket: "touristbuddy-931.appspot.com",
            messagingSenderId: "333888298142"
        };
        firebase.initializeApp(config);

        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        this.setState({ loading: false });
    }

    render() {
        const MainNavigator = createBottomTabNavigator({
            welcome: WelcomeScreen,
            auth: AuthScreen,
            main: createBottomTabNavigator({
                map: MapScreen,
                info: InfoScreen
            })
        },{
            lazy: true
        });


        if(this.state.loading)
            return <Expo.AppLoading />;

        return (
            <Provider store={store}>
                <Root>
                    <MainNavigator/>
                </Root>
            </Provider>

        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
