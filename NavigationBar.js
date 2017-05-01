import React, { Component, PropTypes } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    StatusBar
} from 'react-native';

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarSharp = {
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hidden: PropTypes.bool
};

export default class NavigationBar extends Component {
    static propType = {
        style: View.propTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        hide: PropTypes.bool,
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarSharp)
    }

    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '', // 为用户动态设置
            hide: false // 为用户动态设置
        };
    }

    render() {

        // 状态栏
        const status = <View style={[styles.statusBar, this.props.statusBar]}>
            <StatusBar { ...this.props.statusBar }/>
        </View>;
        
        // 如果有titleView就优先显示titleView
        const titleView = this.props.titleView ? this.titleView
            : <View><Text style={ styles.title }>{ this.props.title }</Text></View>;

        // content包含左侧按钮,中间title,和右边按钮
        let content = <View style={ styles.navBar }>
            { this.props.leftButton }
            <View style={ styles.titleViewContainer }>
                { titleView }    
            </View>
            { this.props.rightButton }
        </View>;

        return (
            <View style={ styles.container }>
                { status }
                { content }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gray'
    },
    navBar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS == 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        backgroundColor: '#31708f',
        flexDirection: 'row',
    },
    titleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0
    },
    title: {
        fontSize: 20,
        color: 'white'
    },
    statusBar: {
        height: Platform.OS == 'ios' ? STATUS_BAR_HEIGHT : 0,
    }
});