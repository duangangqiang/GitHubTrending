import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  Image,
  View,
  DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Toast, {DURATION} from 'react-native-easy-toast';

import PopularPage from './PopularPage';
import AsyncStorageTest from '../../temp/AsyncStorageTest';
import MyPage from './my/MyPage';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedTab: 'tb_popular'
    }
  }

  componentDidMount() {
      this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
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
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_polular.png')} />}
            // badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tb_popular' })}>
            <PopularPage />
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_trending'}
            selectedTitleStyle={{color: '#2196f3'}}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tb_trending' })}>
            <AsyncStorageTest></AsyncStorageTest>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_favorite'}
            selectedTitleStyle={{color: '#2196f3'}}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_polular.png')} />}
            onPress={() => this.setState({ selectedTab: 'tb_favorite' })}>
            <View style={styles.page3}></View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_my'}
            selectedTitleStyle={{color: '#2196f3'}}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tb_my' })}>
            <MyPage {...this.props}></MyPage>
          </TabNavigator.Item>
        </TabNavigator>
        <Toast ref={toast => this.toast = toast} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
