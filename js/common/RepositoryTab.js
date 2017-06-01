import React, {Component} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    RefreshControl
} from 'react-native';

import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import PopularCell from './PopularCell';
import TrendingCell from './TrendingCell';
import RepositoryDetailPage from '../page/RepositoryDetailPage';
import Colors from '../constants/Colors';
import URL from '../config/url';

/**
 * 最热页面的单个语言类型的Tab
 */
export default class RepositoryTab extends Component {
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
     * @param timeSpan 时间间隔对象
     * @returns {string} 请求地址
     */
    getUrl(key, timeSpan) {
        return this.isPopularPage ?
            URL.repositorySearch + key + URL.repositoryQuery :
            URL.Trending + key + timeSpan.searchText;
    }

    componentDidMount() {
        this.loadRepositories(this.props.timeSpan);
    }

    componentWillReceiveProps(nexProps) {
        if (nexProps.timeSpan !== this.props.timeSpan) {
            this.loadRepositories(nexProps.timeSpan);
        }
    }

    /**
     * 加载当前标签的项目数据
     */
    loadRepositories(timeSpan) {

        // 显示加载中
        this.setState({
            isLoading: true
        });

        // 获取请求地址
        const url = this.getUrl(this.props.tabLabel, timeSpan);

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

                    // 加载网络的项目数据
                    return this.dataRepository.fetchNetRepository(url);
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
            })
            .catch((error) => {
                this.setState({
                    errorMsg: JSON.stringify(error),
                    isLoading: false
                })
            })
    }

    onRefresh() {
        this.loadRepositories(this.props.timeSpan);
    }

    /**
     * 点击就跳转到详情页面
     * @param data 当前行数据
     */
    onSelect(data) {
        this.props.navigator.push({
            component: RepositoryDetailPage,
            params: {
                item: data,
                ...this.props
            }
        });
    }

    /**
     * 生成单行元素
     * @param data 当前行数据
     * @returns {XML}
     */
    renderCell(data) {

        // 需要根据不同的页面来返回不同的组件
        if (this.isPopularPage) {
            return (
                <PopularCell onSelect={(data) => this.onSelect(data)} data={data} />
            );
        } else {
            return (
                <TrendingCell onSelect={(data) => this.onSelect(data)} data={data} />
            );
        }
    }

    render() {
        return (
            <View style={styles.box}>
                <ListView dataSource={this.state.dataSource}
                          renderRow={data => this.renderCell(data)}
                          refreshControl={<RefreshControl refreshing={this.state.isLoading}
                                                          onRefresh={() => this.onRefresh()}
                                                          color={[Colors.main]} // android
                                                          tintColor={Colors.main} // ios
                                                          titleColor={Colors.main} // ios
                          />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        flex: 1
    }
});