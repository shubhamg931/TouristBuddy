import React, { Component } from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';
class ButtonRoundedExample extends Component {
    constructor(props){
        super(props);

        this.state = {
            onPress: this.props.onPress,
            text: this.props.text
        };
    }
    render() {
        return (
            <Container>
                <Content>
                    <Button rounded onPress={this.state.onPress}>
                        <Text>{this.state.text}</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

export { ButtonRoundedExample };