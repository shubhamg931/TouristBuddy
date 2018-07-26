import React from 'react';
import {View} from "react-native";

const CardItem = (props) => {
    return (
        <View style={style.containerStyle}>
            {props.children}
        </View>
    )

};

const style = {
    containerStyle:{
        display: 'flex',
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderColor: '#ddd',
        position: 'relative'
    }
};

export { CardItem };

