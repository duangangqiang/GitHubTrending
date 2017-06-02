import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    WebView
} from 'react-native';

import ViewUtils from '../utils/ViewUtils';
import NavigationBar from '../common/NavigationBar';
import URL from '../config/url';
import Colors from '../constants/Colors';

/**
 * 每个仓库的详情页面
 */
export default class RepositoryDetailPage extends Component {
    constructor(props) {
        super(props);
        let item = this.props.projectModel.item;

        this.state = {
            url: item.html_url ? item.html_url : URL.GitHub + item.fullName,
            title: item.full_name ? item.full_name : item.fullName,
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
                    style={{backgroundColor: Colors.main}}
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