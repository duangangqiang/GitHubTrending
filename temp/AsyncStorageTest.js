import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    AsyncStorage
} from 'react-native';

import NavigationBar from '../js/common/NavigationBar';
import Toast, { DURATION } from 'react-native-easy-toast';

const KEY = 'test';

export default class AsyncStorageTest extends Component {
    constructor(props) {
        super(props);
    }

    onSave() {
        AsyncStorage.setItem(KEY, this.text, error => {
            if (!error) {
                this.toast.show('保存成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('保存失败!', DURATION.LENGTH_LONG);
            }
        })
    }

    onRemove() {
        AsyncStorage.removeItem(KEY, error => {
            if (!error) {
                this.toast.show('移除成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('移除失败!', DURATION.LENGTH_LONG);
            }
        })
    }

    onFetch() {
        AsyncStorage.getItem(KEY, (error, result) => {
            if (!error) {
                if (result) {
                    this.toast.show('结果为: ' + result, DURATION.LENGTH_LONG);
                } else {
                    this.toast.show('Key不存在', DURATION.LENGTH_LONG);
                }
            } else {
                this.toast.show('取值失败!', DURATION.LENGTH_LONG);
            }
        })
    }

    render() {
        return (
          <View style={styles.container}>
                <NavigationBar title={'AsyncStorage'}
                    style={{backgroundColor: '#6495ED'}}></NavigationBar>
                
                <TextInput style={styles.textInput} onChangeText={text => this.text = text}></TextInput>
                <View style={styles.textBox}>
                    <Text style={styles.text} onPress={() => this.onSave()}>保存</Text>
                    <Text style={styles.text} onPress={() => this.onRemove()}>移除</Text>
                    <Text style={styles.text} onPress={() => this.onFetch()}>取出</Text>
                </View>
                <Toast ref={toast => this.toast = toast}></Toast>
          </View>  
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontSize: 20,
        margin: 5
    },
    textInput: {
        borderWidth: 1,
        height: 40,
        margin: 6
    },
    textBox: {
        flexDirection: 'row'
    }
});