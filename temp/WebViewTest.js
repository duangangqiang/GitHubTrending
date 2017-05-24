import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    WebView,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../js/common/NavigationBar';
import {SHOW_TOAST} from '../js/constants/Events';
const URL = 'http://www.imooc.com';

export default class WebViewTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: URL,
            title: '',
            canGoBack: false
        };
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            DeviceEventEmitter.emit(SHOW_TOAST, '到顶了');
        }
    }

    go() {
        this.setState({
            url: this.text
        })
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            title: navState.title
        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar
                    title={'WebView使用'}
                />
                <View style={styles.row}>
                    <Text style={styles.tips} onPress={() => {
                        this.goBack()
                    }}>返回</Text>
                    <TextInput style={styles.input} defaultValue={URL} onChangeText={text => this.text = text}/>
                    <Text style={styles.tips} onPress={() => {
                        this.go()
                    }}>前往</Text>
                </View>
                <WebView onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
                         source={{uri: this.state.url}}
                         startInLoadingState={true}
                         ref={webView => this.webView = webView}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    tips: {
        fontSize: 22,
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 2
    }
});