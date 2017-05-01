import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default class Girl extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>I am Girl</Text>
                <Text style={styles.text}>我收到了男孩送的{ this.props.word }</Text>
                <Text style={styles.text} 
                    onPress={() => {
                        this.props.onCallBack('一盒巧克力');
                        this.props.navigator.pop();
                    }}>回赠一盒巧克力</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    text: {
        fontSize: 22,
    }
});