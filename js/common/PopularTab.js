import React, {Component} from 'react';
import {
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import DataRepository from '../expand/dao/DataRepository';
import RepositoryCell from './RepositoryCell';
import {SHOW_TOAST} from '../constants/Events';
import Colors from '../constants/Colors';
import {DISPLAY_NET_DATA, DATA_EXPIRED, DISPLAY_CACHE_DATA} from '../constants/Tips';

// 加载项目数据的地址
const URL = 'https://api.github.com/search/repositories?q=';

// 其他查询参数
const QUERY_STR = '&sort=stars';

/**
 * 最热页面的单个语言类型的Tab
 */
export default class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            errorMsg: '', // 错误消息
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
    }

    /**
     * 拼接请求地址
     * @param key 要加载的标签关键字
     * @returns {string} 请求地址
     */
    static getUrl(key) {
        return URL + key + QUERY_STR;
    }

    componentDidMount() {
        this.loadRepositories();
    }

    /**
     * 加载当前标签的项目数据
     */
    loadRepositories() {

        // 显示加载中
        this.setState({
            isLoading: true
        });

        // 获取请求地址
        const url = PopularTab.getUrl(this.props.tabLabel);

        // 根据请求地址加载数据
        this.dataRepository.fetchRepository(url)
            .then(result => {

                // 如果加载了缓存数据,会进入到这里,如果没有就是空数组
                let items = result && result.items ? result.items : (result ? result : []);

                // 设置状态
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });

                // 如果数据过期了
                if (result && result.update_date && !DataRepository.checkData(result.update_date)) {
                    DeviceEventEmitter.emit(SHOW_TOAST, DATA_EXPIRED);

                    // 加载网络的项目数据
                    return this.dataRepository.fetchNetRepository(url);
                } else {

                    // 提示使用了缓存数据
                    DeviceEventEmitter.emit(SHOW_TOAST, DISPLAY_CACHE_DATA);
                }
            })
            .then(items => {

                // 走到这里代表加载了网络数据
                if (!items || items.length === 0) {
                    return;
                }

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                });

                DeviceEventEmitter.emit(SHOW_TOAST, DISPLAY_NET_DATA);
            })
            .catch(() => {
                this.setState({
                    errorMsg: JSON.stringify(error),
                    isLoading: false
                })
            })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={(data) => <RepositoryCell data={data}/>}
                          refreshControl={<RefreshControl
                              refreshing={this.state.isLoading}
                              onRefresh={() => this.loadRepositories()}
                              color={[Colors.main]} // android
                              tintColor={Colors.main} // ios
                              titleColor={Colors.main} // ios
                          />}
                />
            </View>
        );
    }
}