import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import PopularTab from '../common/PopularTab';
import Colors from '../constants/Colors';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import {SHOW_TOAST} from '../constants/Events';
import {LOAD_LANGUAGE_LIST_FAIL} from '../constants/Tips';

/**
 * 最热页面
 */
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [] // 当前显示的语言列表
        };
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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
            return lan.checked ? <PopularTab key={index} tabLabel={lan.name} {...this.props}/> : null;
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

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'最热项目'}
                    statusBar={{
                        backgroundColor: Colors.main
                    }}
                />
                { this.renderContent() }
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