import React, { Component } from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text } from "native-base";
class HeaderNoShadow extends Component {
    render() {
        return (
            <Header noShadow>
                <Left>
                    <Button transparent>
                        <Icon name="arrow-back" />
                    </Button>
                </Left>
                <Body>
                <Title>{this.props.headerText}</Title>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon name="menu" />
                    </Button>
                </Right>
            </Header>
        );
    }
}

export { HeaderNoShadow };