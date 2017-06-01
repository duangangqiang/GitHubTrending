import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';
import PAGE_CONFIG from '../../config/pages';
import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import SortKeyPage from './SortKeyPage';

/**
 * 我的页面
 */
export default class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title={PAGE_CONFIG[MyPage.name].cnName}
                    statusBar= {{
                        backgroundColor: Colors.main
                    }}
                />
                <Text style={styles.tips} onPress={() => 
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_key
                        }
                    })}
                >自定义标签</Text>
                <Text style={styles.tips} onPress={() =>
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_language
                        }
                    })}
                >自定义语言</Text>
                <Text style={styles.tips} onPress={() => this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            ...this.props,
                            flag: FLAG_LANGUAGE.flag_key
                        }
                    })}
                >标签排序</Text>
                <Text style={styles.tips} onPress={() => this.props.navigator.push({
                    component: SortKeyPage,
                    params: {
                        ...this.props,
                        flag: FLAG_LANGUAGE.flag_language
                    }
                })}
                >语言排序</Text>
                <Text style={styles.tips} onPress={() => this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {...this.props, isRemoveKey: true}
                    })}
                >标签移除</Text>
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