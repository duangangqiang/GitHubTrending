import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import CheckBox from 'react-native-check-box';

import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import Colors from '../../constants/Colors';
import ArrayUtils from '../../utils/ArrayUtils';
import {SHOW_TOAST} from '../../constants/Events';
import {LOAD_LANGUAGE_LIST_FAIL} from '../../constants/Tips';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

/**
 * 自定义标签页面
 * 有两个功能:
 *  1.对要展示的标签进行自定义;
 *  2.对所有标签进行移除的操作.
 */
export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = []; // 所有的改动数组
        this.isRemoveKey = this.props.isRemoveKey; // 是否是在进行标签移除
        this.state = {
            dataArray: [] // 所有的标签数组
        };
    }

    /**
     * 加载语言数据
     */
    loadLanguage() {
        this.languageDao.fetch().then(result => {
            this.setState({
                dataArray: result
            });
        }).catch(() => {
            DeviceEventEmitter.emit(SHOW_TOAST, LOAD_LANGUAGE_LIST_FAIL);
        })
    }

    componentDidMount() {

        // 在组件初始化的时候new这个dao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.loadLanguage();
    }

    /**
     * 点击右侧的保存按钮的响应函数
     */
    onSave() {

        // 如果没有改动,就直接返回
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {

            // 如果是标签移除,才将选中的数组从原始的数组中移除
            if (this.isRemoveKey) {
                for (let i = 0, l = this.changeValues.length; i < l; i++) {
                    ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
                }
            }

            // 将结果数组保存到缓存中
            this.languageDao.save(this.state.dataArray);

            // 返回
            this.props.navigator.pop();
        }
    }

    /**
     * 点击返回的响应函数
     */
    onBack() {

        // 没有改动直接返回
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {

            // 如果有改动.需要弹出提示,如果保存,则调用保存方法
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
     * 点击其中的某一个标签的响应函数
     * @param data 当前点击的标签
     */
    onClick(data) {

        // 如果是在移除标签,不需要设置状态
        if (!this.isRemoveKey) {
            data.checked = !data.checked;
        }

        // 更新当前点击的项在changeValues中的状态,如果存在就移除,如果不存在就添加
        ArrayUtils.updateArray(this.changeValues, data);
    }

    /**
     * 生成滚动屏幕中的数据
     * @returns {[XML]}
     */
    renderView() {

        // 如果数据还没有加载完成,先返回null
        if (!this.state.dataArray || this.state.dataArray.length === 0) {
            return null
        }

        // 遍历当前的所有标签数组,生成两个为一行的View数组
        const len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.underLine}/>
                </View>
            );
        }

        // 补全剩余的数组
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
                <View style={styles.underLine}/>
            </View>
        );

        return views;
    }

    /**
     * 生成checkbox的元素
     * @param data 当前要渲染的行的数据
     * @returns {XML}
     */
    renderCheckBox(data) {
        let leftText = data.name;

        // 如果是移除标签,这里不让其选中
        let isChecked = this.isRemoveKey ? false : data.checked;
        return (
            <CheckBox
                style={styles.checkbox}
                onClick={() => this.onClick(data)}
                leftText={ leftText }
                isChecked={ isChecked }
                checkedImage={ <Image style={styles.checkedImage} source={require('./img/ic_check_box.png')}/> }
                unCheckedImage={ <Image style={styles.unCheckedImage}
                                        source={require('./img/ic_check_box_outline_blank.png')}/> }
            />
        );
    }

    render() {
        // 两种操作显示不同内容
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';

        // 右侧文字
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={ title }
                    statusBar={{backgroundColor: '#2196f3'}}
                    leftButton={ ViewUtils.getLeftButton(() => this.onBack()) }
                    rightButton={ ViewUtils.getRightButton(rightButtonTitle, () => this.onSave()) }
                />
                <ScrollView>{ this.renderView() }</ScrollView>
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
    underLine: {
        height: 0.3,
        backgroundColor: Colors.ddd,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkbox: {
        flex: 1,
        padding: 10
    },
    checkedImage: {
        tintColor: Colors.main
    },
    unCheckedImage: {
        tintColor: Colors.main
    }
});