import React, {Component} from 'react';
import {ScrollView, View, Dimensions, StyleSheet} from "react-native";
import {Button, Text, Icon, Content} from "native-base";

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component{
    renderLastSlide(index){
        if(index === this.props.data.length - 1){
            return (
                <Content>
                    <Button style={StyleSheet.flatten(styles.buttonStyle)} onPress={this.props.onComplete} iconLeft>
                        <Icon name='home' />
                        <Text>Let us Start!</Text>
                    </Button>
                </Content>
            );
        }
    }

    renderSlides() {
        return this.props.data.map((slide, index) => {
            return (
                <View key={slide.text} style={[styles.slideStyle, {backgroundColor: slide.color}]}>
                    <Text style={styles.slideTextStyle}>{slide.text}</Text>
                    {this.renderLastSlide(index)}
                </View>
            );
        });
    }
    render(){
        return(
          <ScrollView
          horizontal
          style={{flex: 1}}
          pagingEnabled>
              {this.renderSlides()}
          </ScrollView>
        );
    }
}

const styles = {
    slideStyle:{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: SCREEN_WIDTH
    },
    slideTextStyle: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: 15
    }
};

export default Slides;