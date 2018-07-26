import {FACEBOOK_LOGIN_FAIL, FACEBOOK_LOGIN_SUCCESS, NAVIGATE_TO_MAPS, TYPE_NOT_SPECIFIED} from "./types";
import {Facebook} from "expo";
import {AsyncStorage, Alert} from 'react-native';
import firebase from 'firebase';

export const navigateToMaps = (user, callback) => {
    console.log("payload sent");
    return (dispatch) => {
        console.log("user before dispatch: " + JSON.stringify(user));
        dispatch({type: NAVIGATE_TO_MAPS, payload: user});
        callback();
    };
};

export const facebookLogin = (state) => {
    return async (dispatch) => {
        let token = await AsyncStorage.getItem("fb_token");
        if (token) {
            dispatch({type: FACEBOOK_LOGIN_SUCCESS, payload: token});
        } else {
            doFacebookLogin(state, dispatch);
        }
    }
};

const doFacebookLogin = async (state, dispatch) => {
    let {type, token} = await Facebook.logInWithReadPermissionsAsync('963741817140614', {
        permissions: ['public_profile']
    });

    console.log("state passed inn facebook login: " + JSON.stringify(state));

    if (type === 'cancel') {
        return dispatch({type: FACEBOOK_LOGIN_FAIL, payload: "Facebook Login Failed!"});
    }
    await AsyncStorage.setItem('signedIn', "1");
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then((user) => {
            console.log("facebook user created : " + JSON.stringify(user));
            const db = firebase.firestore();
            const settings = {timestampsInSnapshots: true};
            db.settings(settings);
            db.collection("drivers").doc(user.user.uid).set({
                name: user.user.displayName,
                email: user.user.email,
                phone: user.user.phoneNumber,
                photoURL: user.user.photoURL,
                loginMethod: "fb",
                currentLocation: {},
                type: state.selected2,
                driverName: state.driverName,
                busnumber: state.busNumber
            })
                .then(() => {
                    console.log("driver successfully added to database!");
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log("firebase facebook login error: " + err));
    console.log("TOKEN: " + token);
    dispatch({type: FACEBOOK_LOGIN_SUCCESS, payload: token});
};