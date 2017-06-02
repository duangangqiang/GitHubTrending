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
import ProjectModel from '../model/ProjectModel';
import Utils from '../utils/Utils';
import RepositoryDetailPage from '../page/RepositoryDetailPage';
import Colors from '../constants/Colors';
import URL from '../config/url';

/**
 * 最热页面的单个语言类型的Tab
 */
export default class RepositoryTab extends Component {
    constructor(props) {
        super(props);

        // 是否是最热模块的标记
        this.isPopularPage = this.props.isPopularPage;

        // 从父传递过来,整个页面使用一个dao
        this.favoriteDao = this.props.favoriteDao;

        // 根据不同页面传递不同标志
        this.dataRepository = new DataRepository(this.isPopularPage ? FLAG_STORAGE.flag_popular : FLAG_STORAGE.flag_trending);
        this.state = {
            errorMsg: '', // 错误消息
            isLoading: false, // 加载状态
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }), // 项目列表
            favoriteKeys: [] // 已经收藏的项目keys
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

        // 选择的时间段变化的时候需要重新加载项目
        if (nexProps.timeSpan !== this.props.timeSpan) {
            this.loadRepositories(nexProps.timeSpan);
        }
    }

    /**
     * 能够更新项目的收藏状态
     */
    flushFavoriteState() {
        let projectModels = [],
            items = this.items;

        for (let i = 0, len = items.length; i < len; i++) {
            projectModels.push(
                new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys))
            );
        }

        this.setState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels)
        })
    }

    /**
     * 使用数据来创建dataSource
     * @param data 源数据
     * @returns {ListViewDataSource}
     */
    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    /**
     * 获取已经收藏的所有项目的keys
     */
    getFavoriteKeys() {
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.setState({
                        favoriteKeys: keys
                    });
                }
                this.flushFavoriteState();
            })
            .catch(() => {
                this.flushFavoriteState();
            })
    }

    /**
     * 加载当前标签的项目数据
     */
    loadRepositories(timeSpan) {

        // 显示加载中
        this.setState({ isLoading: true });

        // 获取请求地址
        const url = this.getUrl(this.props.tabLabel, timeSpan);

        // 根据请求地址加载数据
        this.dataRepository.fetchRepository(url)
            .then(result => {

                // 如果加载了缓存数据,会进入到这里,如果没有就是空数组
                this.items = result && result.items ? result.items : (result ? result : []);

                // 加载收藏的项目数据
                this.getFavoriteKeys();

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
                this.items = items;

                // 加载收藏的项目数据
                this.getFavoriteKeys();
            })
            .catch((error) => {
                this.setState({
                    errorMsg: JSON.stringify(error),
                    isLoading: false
                })
            })
    }

    /**
     * ListView的刷新回调函数
     */
    onRefresh() {

        // 使用当前的timeSpan进行更新数据
        this.loadRepositories(this.props.timeSpan);
    }

    /**
     * 点击就跳转到详情页面
     * @param projectModel 当前行数据
     */
    onSelect(projectModel) {
        this.props.navigator.push({
            component: RepositoryDetailPage,
            params: {
                projectModel: projectModel, // 将整个ProjectModel作为参数传递进去,在WebView中也可以拿到收藏状态
                ...this.props
            }
        });
    }

    /**
     * 点击收藏的回调函数
     * @param item 当前点击的项
     * @param isFavorite 是否收藏
     */
    onFavoritePress(item, isFavorite) {
        if (isFavorite) {
            this.favoriteDao.addFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    /**
     * 生成单行元素
     * @param ProjectModel 当前行数据
     * @returns {XML}
     */
    renderCell(ProjectModel) {

        // 需要根据不同的页面来返回不同的组件
        if (this.isPopularPage) {
            return (
                <PopularCell key={ProjectModel.item.id} onSelect={(ProjectModel) => this.onSelect(ProjectModel)}
                             projectModel={ProjectModel}
                             onFavoritePress={(item, isFavorite) => this.onFavoritePress(item, isFavorite)}/>
            );
        } else {
            return (
                <TrendingCell key={ProjectModel.item.id} onSelect={(ProjectModel) => this.onSelect(ProjectModel)}
                              projectModel={ProjectModel}/>
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