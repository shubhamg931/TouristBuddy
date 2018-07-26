import React, {Component} from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import {Image} from "react-native";

class InfoScreen extends Component{
    render(){
        return(
            <Container>
                <Content>
                    <Card style={{flex: 0}}>
                    <CardItem>
                        <Left>
                            <Thumbnail source={{uri: '../assets/logo.jpeg'}} />
                            <Body>
                            <Text>Train Number</Text>
                            <Text note>Start-End</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Image source={{uri: '../assets/bus.png'}} style={{height: 200, width: 200, flex: 1}}/>
                        <Text>
                            Train data to come here!
                        </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Button transparent textStyle={{color: '#87838B'}}>
                                <Icon name="logo-star" />
                                <Text>1,926 stars</Text>
                            </Button>
                        </Left>
                    </CardItem>
                </Card>
                </Content>
            </Container>
        );
    }
}

export default InfoScreen;