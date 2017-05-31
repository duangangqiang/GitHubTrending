import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Toast, {DURATION} from 'react-native-easy-toast';

import Colors from '../constants/Colors';
import {SHOW_TOAST} from '../constants/Events';
import PAGE_CONFIG from '../config/pages';

import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import WebViewTest from '../../temp/WebViewTest';
import MyPage from './my/MyPage';

// 当前所有Tab页面的所有组件
const PageTabs = [PopularPage, TrendingPage, WebViewTest, MyPage];

/**
 * 首页
 */
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: PAGE_CONFIG[PopularPage.name].flag
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(SHOW_TOAST, (text) => {
            this.toast.show(text, DURATION.LENGTH_LONG);
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    /**
     * 生成每个tab页签
     * @param Component 当前页签展示的组件
     * @param selectTab 当前选中的组件key
     * @param title tab的名字
     * @param icon tab的图标
     * @param index 下标
     * @returns {XML}
     * @private
     */
    _renderTab(Component, selectTab, title, icon, index) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectTab}
                selectedTitleStyle={{color: Colors.main}}
                title={title}
                key={index}
                renderIcon={() => <Image style={styles.image} source={icon}/>}
                renderSelectedIcon={() => <Image style={[styles.image, {tintColor: Colors.main}]} source={icon}/>}
                // badgeText="1" // 小红点
                onPress={() => this.setState({selectedTab: selectTab})}>
                <Component {...this.props}/>
            </TabNavigator.Item>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {
                        PageTabs.map((component, index) => {
                            return this._renderTab(component, PAGE_CONFIG[component.name].flag, PAGE_CONFIG[component.name].cnName,
                                PAGE_CONFIG[component.name].icon, index);
                        })
                    }
                </TabNavigator>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fcff'
    },
    image: {
        width: 22,
        height: 22
    }
});
