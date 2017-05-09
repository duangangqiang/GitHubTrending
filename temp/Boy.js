import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import Girl from './Girl';

import NavigationBar from './NavigationBar';

export default class Boy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            word: ''
        }
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
            <View style={styles.container}>
                <NavigationBar 
                    title={'Boy'}
                    style = {{
                        backgroundColor: '#87CEFF'
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
                ></NavigationBar>
                <Text style={styles.text}> I am Boy </Text>
                <Text style={styles.text} onPress={() =>{
                        this.props.navigator.push({
                            component: Girl,
                            params: {
                                word: '一直玫瑰',
                                onCallBack: (word) => {
                                    this.setState({
                                        word: word
                                    });
                                }
                            }
                        });
                    }}>送女孩一只玫瑰</Text>
                <Text style={styles.text}>{ this.state.word }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontSize: 20
    }
});