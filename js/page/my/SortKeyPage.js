import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import SortableListView from 'react-native-sortable-listview';

import NavigationBar from '../../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtils from '../../utils/ArrayUtils';
import {SHOW_TOAST} from '../../constants/Events';
import ViewUtils from '../../utils/ViewUtils';

/**
 * 标签排序页面
 */
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
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    /**
     * 加载所有被选中的标签项数组
     */
    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.dataArray = result; // 将原始的所有标签的数组保存起来

                const checkedArray = SortKeyPage.getCheckedItems(result);
                this.setState({checkedArray}); // 把已经选中的标签数组设置到state上

                this.originalCheckedArray = ArrayUtils.clone(checkedArray); // 备份原始被选中的标签数组
            })
            .catch(() => {
                DeviceEventEmitter.emit(SHOW_TOAST, '加载数据失败');
            })
    }

    /**
     * 通过原始的标签数组获取被选中的标签数组
     * @param {*} result
     * @return
     */
    static getCheckedItems(result) {
        let checkedArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];

            if (data.checked) {
                checkedArray.push(data);
            }
        }
        return checkedArray;
    }

    /**
     * 返回按钮操作
     */
    onBack() {

        // 如果备份的被选中的数组和当前选中的数组一样(包括长度和顺序),则直接返回
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
        } else {
            Alert.alert('提示', '要保存修改吗?', [{
                text: '不保存', onPress: () => {
                    this.props.navigator.pop();
                }
            }, {
                text: '保存', onPress: () => {
                    this.onSave();
                }
            }]);
        }
    }

    /**
     * 获取排序结果
     */
    getSortResult() {

        // 先从原始的所有标签克隆一份
        this.sortResultArray = ArrayUtils.clone(this.dataArray);

        // 遍历原始被选中的标签数组
        for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
            let item = this.originalCheckedArray[i];

            // 拿到此项在原始标签数组中的下标
            let index = this.dataArray.indexOf(item);

            // 在新的排序数组中替换
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    /**
     * 保存方法
     * @param {*} isChecked 如果已经检查过是否改动
     */
    onSave(isChecked) {
        if (!isChecked && ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }

        this.getSortResult();
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    render() {
        let rightButton = <TouchableOpacity onPress={() => this.onSave()}>
            <View style={styles.saveBtnBox}>
                <Text style={styles.saveBtn}>保存</Text>
            </View>
        </TouchableOpacity>;
        let title = this.props.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'标签排序'}
                    leftButton={ ViewUtils.getLeftButton(() => this.onBack()) }
                    rightButton={ rightButton }
                />
                <SortableListView
                    style={{flex: 1}}
                    data={ this.state.checkedArray }
                    order={ Object.keys(this.state.checkedArray) }
                    onRowMoved={e => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={ row => <SortCell data={row}/> }
                />
            </View>
        );
    }
}

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image style={styles.image} source={require('./img/ic_sort.png')}/>
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
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
    item: {
        padding: 25,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        tintColor: '#2196f3',
        height: 16,
        width: 16,
        marginRight: 10
    },
    saveBtn: {
        fontSize: 20,
        color: '#fff'
    },
    saveBtnBox: {
        margin: 10
    }
});