import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Navigator
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';

export default class WelcomePage extends Component {
    componentDidMount() {
        this.timer = setTimeout(() => {

            // 重置导航记录
            this.props.navigator.resetTo({
                component: HomePage
            });
        }, 2000);
    }

    componentWillUnMount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View>
                <NavigationBar title={'欢迎'}/>
                <Text>欢迎</Text>
            </View>
        );
    }
}