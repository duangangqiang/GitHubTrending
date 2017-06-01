import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import Colors from '../constants/Colors';
import PAGE_CONFIG from '../config/pages';

/**
 * 欢迎页面
 */
export default class WelcomePage extends Component {
    componentDidMount() {
        // this.timer = setTimeout(() => {
        //
        //     // 重置导航记录
        //     this.props.navigator.resetTo({
        //         component: HomePage
        //     });
        // }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={PAGE_CONFIG[WelcomePage.name].cnName}
                    statusBar={{
                        backgroundColor: Colors.fff
                    }}
                />
                <Image style={styles.loge} source={require('../../res/images/logo.png')}/>
                <Text style={styles.name}>GitHub Trending</Text>
                <Text style={styles.by}>by Duan Gangqiang</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loge: {
        width: 200,
        height: 200
    },
    name: {
        fontSize: 24,
        marginTop: 20
    },
    by: {
        fontSize: 14,
        marginTop: 10
    }
});