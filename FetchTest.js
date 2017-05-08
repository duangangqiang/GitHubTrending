import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';

import NavigationBar from './NavigationBar';
import HttpUtils from './HttpUtils';

export default class FetchTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ''
        };
    }

    onLoad (url) {
        
        HttpUtils.get(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    onSubmit(url, data) {
        HttpUtils.post(url, data)
        .then(result => {
            this.setState({
                result: JSON.stringify(result)
            })
        })
        .catch(error => {
            this.setState({
                result: JSON.stringify(error)
            })
        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar 
                    title={'Fetch'}
                    style={{
                        backgroundColor: "#EE6363"
                    }}
                />
                <Text style={styles.text} onPress= {() => this.onLoad('http://rap.taobao.org/mockjsdata/11793/test')}>获取数据</Text>
                <Text style={styles.text} onPress= {() => this.onSubmit('http://rap.taobao.org/mockjsdata/11793/submit', {
                        userName: '小明',
                        password: '123456'
                    })}>提交数据</Text>
                <Text>返回结果11: {this.state.result}</Text>
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