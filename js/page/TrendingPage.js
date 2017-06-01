import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import RepositoryTab from '../common/RepositoryTab';
import Colors from '../constants/Colors';
import PAGE_CONFIG from '../config/pages';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {SHOW_TOAST} from '../constants/Events';
import {LOAD_LANGUAGE_LIST_FAIL} from '../constants/Tips';
import Popover from '../common/Popover';
import TimeSpan from '../model/TimeSpan';

// 时间区间下拉数组
const timeSpanTextArray = [
    new TimeSpan('今天', '?since=daily'),
    new TimeSpan('本周', '?since=weekly'),
    new TimeSpan('本月', '?since=monthly')
];

/**
 * 趋势页面
 */
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [], // 当前显示的语言列表
            isVisible: false, // 是否显示下拉
            buttonRect: {},
            timeSpan: timeSpanTextArray[0]
        };
    }

    componentDidMount() {

        // 此处使用flag_language来创建LanguageDao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.loadLanguage();
    }

    /**
     * 加载语言列表
     */
    loadLanguage() {
        this.languageDao.fetch().then(result => {
            this.setState({
                languages: result
            });
        }).catch(() => {
            DeviceEventEmitter.emit(SHOW_TOAST, LOAD_LANGUAGE_LIST_FAIL);
        })
    }

    /**
     * 生成当前的项目项列表
     * @returns {Array}
     */
    renderPopularTab() {
        return this.state.languages.map((item, index, arr) => {
            let lan = arr[index];
            return lan.checked ? <RepositoryTab key={index} tabLabel={lan.name}
                                                timeSpan={this.state.timeSpan} {...this.props}/> : null;
        })
    }

    /**
     * 生成当前页面的下拉视图
     * @returns {XML}
     */
    renderContent() {

        // 如果有内容才渲染这个ScrollableTabView
        return this.state.languages.length > 0 ? <ScrollableTabView
            tabBarBackgroundColor='#2196f3'
            tabBarInactiveTextColor='#f5fffa'
            tabBarActiveTextColor='#fff'
            tabBarUnderlineStyle={{
                backgroundColor: Colors.e7e7e7,
                height: 2
            }}
            renderTabBar={() => <ScrollableTabBar/>}>
            { this.renderPopularTab() }
        </ScrollableTabView> : null;
    }

    renderTitleView() {
        return (
            <View>
                <TouchableOpacity ref="downArrow" onPress={() => this.showPopover()}>
                    <View style={styles.topDateFilter}>
                        <Text style={styles.title}>趋势 {this.state.timeSpan.showText}</Text>
                        <Image style={styles.downArrow}
                               source={require('../../res/images/ic_spinner_triangle.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    showPopover() {
        this.refs.downArrow.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan,
            isVisible: false
        });
    }

    renderPopover() {
        return (
            <Popover isVisible={this.state.isVisible} fromRect={this.state.buttonRect}
                     onClose={() => this.closePopover()} placement="bottom"
                     contentStyle={styles.timeBox}>
                {
                    timeSpanTextArray.map((item, index, arr) =>{
                        return <TouchableOpacity key={index} underlayColor="transparent"
                                    onPress={() => this.onSelectTimeSpan(arr[index])}>
                            <Text style={styles.timeLabel}>{ arr[index].showText }</Text>
                        </TouchableOpacity>;
                    })
                }
            </Popover>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView={this.renderTitleView()}
                    statusBar={{
                        backgroundColor: Colors.main
                    }}
                />
                { this.renderContent() }
                { this.renderPopover() }
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
    },
    topDateFilter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    downArrow: {
        width: 10,
        height: 10,
        marginLeft: 5,
        marginBottom: 2
    },
    title: {
        fontSize: 18,
        color: Colors.fff,
        fontWeight: '400'
    },
    timeLabel: {
        fontSize: 18,
        color: Colors.fff,
        fontWeight: '400',
        padding: 8
    },
    timeBox: {
        backgroundColor: '#343434',
        opacity: 0.82
    }
});