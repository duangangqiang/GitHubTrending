import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  View,
  ListView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import DataRepository from '../expand/dao/DataRepository';
import NavigationBar from '../common/NavigationBar';
import RepositoryCell from '../common/RepositoryCell';

import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            result: '',
            languages: []
        };
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.languageDao.fetch().then(result => {
            this.setState({
                languages: result
            });
        }).catch(error => {
            console.log(error);
        })
    }


    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    onLoad() {
        let url = this.getUrl(this.text);
        this.dataRepository.fetchNetRepository(url)
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
        let content = this.state.languages.length > 0 ? <ScrollableTabView
                tabBarBackgroundColor = '#2196f3'
                tabBarInactiveTextColor = 'mintcream'
                tabBarActiveTextColor = 'white'
                tabBarUnderlineStyle = {{
                    backgroundColor: '#e7e7e7',
                    height: 2
                }}
                renderTabBar={() => <ScrollableTabBar/>}>
                    {this.state.languages.map((result, index, arr) => {
                        let lan = arr[index];
                        return lan.checked ? <PopularTab key={index} tabLabel={lan.name}></PopularTab> : null;
                    })}
                </ScrollableTabView> : null;
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title={'最热项目'}
                    statusBar= {{
                        backgroundColor: '#2196f3'
                    }}
                />
                { content }
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

class PopularTab extends Component {
     constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }

    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url = this.getUrl(this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : (result ? result : []);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items),
                    isLoading: false
                });
                if (result && result.update_date && !this.dataRepository.checkData(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }
            })
            .then(items => {
                if (!items || items.length === 0) {
                    return;
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据');
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error),
                    isLoading: false
                })
            })
    }

    renderRow(data) {
        return <RepositoryCell data={data} />;
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={<RefreshControl 
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.loadData()}
                    color={['#2196f3']} // android    
                    tintColor = {'#2196f3'} // ios
                    titleColor={'#2196f3'} // ios
                />}
            ></ListView>
        </View>
    }
}