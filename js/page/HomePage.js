import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Toast, {DURATION} from 'react-native-easy-toast';

import {SHOW_TOAST} from '../constants/Events';
import PopularPage from './PopularPage';
import AsyncStorageTest from '../../temp/AsyncStorageTest';
import MyPage from './my/MyPage';
import WebViewTest from '../../temp/WebViewTest';

/**
 * 首页
 */
export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'tb_popular'
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

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="最热"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_popular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                                         source={require('../../res/images/ic_popular.png')}/>}
                        // badgeText="1"
                        onPress={() => this.setState({selectedTab: 'tb_popular'})}>
                        <PopularPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="趋势"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                                         source={require('../../res/images/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_trending'})}>
                        <AsyncStorageTest />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="收藏"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_popular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                                         source={require('../../res/images/ic_popular.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
                        <WebViewTest/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="我的"
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                                         source={require('../../res/images/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_my'})}>
                        <MyPage {...this.props} />
                    </TabNavigator.Item>
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
    page1: {
        flex: 1,
        backgroundColor: 'red'
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    page3: {
        flex: 1,
        backgroundColor: 'blue'
    },
    page4: {
        flex: 1,
        backgroundColor: 'pink'
    },
    image: {
        width: 22,
        height: 22
    }
});
