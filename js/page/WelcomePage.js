import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import Colors from '../constants/Colors';

/**
 * 欢迎页面
 */
export default class WelcomePage extends Component {
    componentDidMount() {
        this.timer = setTimeout(() => {

            // 重置导航记录
            this.props.navigator.resetTo({
                component: HomePage
            });
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View>
                <NavigationBar
                    title={'欢迎'}
                    statusBar={{
                        backgroundColor: Colors.main
                    }}
                />
                <Text>欢迎</Text>
            </View>
        );
    }
}