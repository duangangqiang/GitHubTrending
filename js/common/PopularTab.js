import React, {Component} from 'react';
import {
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import RepositoryCell from './RepositoryCell';
import RepositoryDetail from '../page/RepositoryDetail';
import {SHOW_TOAST} from '../constants/Events';
import Colors from '../constants/Colors';
import {DISPLAY_NET_DATA, DATA_EXPIRED, DISPLAY_CACHE_DATA} from '../constants/Tips';

// Popular页面加载项目数据的地址
const URL = 'https://api.github.com/search/repositories?q=';

// Popular页面其他查询参数
const QUERY_STR = '&sort=stars';

// Trending页面的地址
const TRENDING_URL = 'https://github.com/trending/';

/**
 * 最热页面的单个语言类型的Tab
 */
export default class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.isPopularPage = this.props.isPopularPage;

        // 根据不同页面传递不同标志
        this.dataRepository = new DataRepository(this.isPopularPage ? FLAG_STORAGE.flag_popular : FLAG_STORAGE.flag_trending);
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
    getUrl(key) {
        return this.isPopularPage ? URL + key + QUERY_STR : TRENDING_URL + key;
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
        const url = this.getUrl(this.props.tabLabel);

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

    onSelect(data) {
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                item: data,
                ...this.props
            }
        });
    }

    renderCell(data) {
        return (
            <RepositoryCell onSelect={(data) => this.onSelect(data)}
                            data={data} isPopularPage={this.isPopularPage}/>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={data => this.renderCell(data)}
                          refreshControl={<RefreshControl refreshing={this.state.isLoading}
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