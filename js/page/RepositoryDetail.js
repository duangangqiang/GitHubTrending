import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    WebView
} from 'react-native';

import ViewUtils from '../utils/ViewUtils';
import NavigationBar from '../common/NavigationBar';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url = this.props.item.html_url;
        let title = this.props.item.full_name;
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false
        };
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack
        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#6495ED'}}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                />
                <WebView onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
                         source={{uri: this.state.url}}
                         ref={webView => this.webView = webView}
                         startInLoadingState={true}/>
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