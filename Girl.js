import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';

import NavigationBar from './NavigationBar';

export default class Girl extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    renderButton(image) {
        return (
            <TouchableOpacity
                onPress = { () => {
                    this.props.navigator.pop();
                }}
            >
                <Image style={{ width: 22, height: 22, margin: 5 }} source={image}></Image>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar 
                    title={'Girl'}
                    style={{
                        backgroundColor: "#EE6363"
                    }}
                    statusBar = {{
                        backgroundColor: "#EE6363",
                        hidden: true
                    }}
                    leftButton = {
                        this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))
                    }
                    rightButton = {
                        this.renderButton(require('./res/images/ic_star.png'))
                    }
                />
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
        backgroundColor: '#FFF'
    },
    text: {
        fontSize: 22,
    }
});