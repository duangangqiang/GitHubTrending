import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  View,
  ListView,
  RefreshControl
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';

export default class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    onPress() {
        this.props.navigator.push({
            component: CustomKeyPage,
            params: {...this.props}
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title={'我的'}
                    statusBar= {{
                        backgroundColor: '#2196f3'
                    }}
                />
                <Text style={styles.tips} onPress={() => this.onPress()}>自定义标签</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    }
});