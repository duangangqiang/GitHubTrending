import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SorttableListView from 'react-native-sortable-listview'

import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';

import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';
import ArrayUtils from '../../utils/ArrayUtils';

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);

        this.dataArray = []; // 从数据库中读取的所有标签的数组
        this.sortResultArray = []; // 排序之后新生成的所有标签的数组
        this.originalCheckedArray = []; // 上次标签排序的顺序数组

        this.state = {
            checkedArray: [] // 已经订阅的标签筛选出来的结果数组
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.getCheckedItems(result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCheckedItems(result) {
        this.dataArray = result; // 备份一份

        let checkedArray = [];

        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];

            if (data.checked) {
                checkedArray.push(data);
            }
        }
        this.setState({
            checkedArray: checkedArray
        });

        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    onPress() {
        this.props.navigator.push({
            component: CustomKeyPage,
            params: {...this.props}
        })
    }

    render() { 
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title={'我的'}
                    statusBar= {{
                        backgroundColor: '#2196f3'
                    }}
                />
                <SorttableListView 
                    style = {{ flex: 1 }}
                    data = { this.state.checkedArray }
                    order = { Object.keys(this.state.checkedArray) }
                    onRowMoved = {e => {
                        order.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow = { row => <SortCell data = {row} /> }
                ></SorttableListView>
            </View>
        );
    }
}

class SortCell extends Component {
    render() {
        return (
            <View>
                <Text>{ this.props.data.name }</Text>
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