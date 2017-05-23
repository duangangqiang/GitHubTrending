import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import ArrayUtils from '../../utils/ArrayUtils';
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.changeValues = [];
        this.isRemoveKey = this.props.isRemoveKey ? true : false;
        this.state = {
            dataArray: []
        };
    }

    loadData() {
        this.languageDao.fetch().then(result => {
            this.setState({
                dataArray: result
            });
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.loadData();
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
            }
            this.languageDao.save(this.state.dataArray);
            this.props.navigator.pop();
        }
    }

    onBack() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {
            Alert.alert('提示', '要保存修改吗?', [
                { text: '不保存', onPress: () => { this.props.navigator.pop(); } },
                { text: '保存', onPress: () => { this.onSave(); } }
            ]);
        }
    }

    onClick(data) {
        if (!this.isRemoveKey) {
            data.checked = !data.checked;
        }
        ArrayUtils.updateArray(this.changeValues, data);
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) {
            return null
        }
        const len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i+=2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i+1])}
                    </View>
                    <View style={styles.underLine}></View>
                </View>
            );
        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len-2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len-1])}
                </View>
                <View style={styles.underLine}></View>
            </View>
        )
        return views;
    }

    renderCheckBox(data) {
        let leftText = data.name;

        // 如果是移除标签,这里不让其选中
        let isChecked = this.isRemoveKey ? false : data.checked;
        return (
            <CheckBox 
                style={styles.checkbox} 
                onClick={() => this.onClick(data)} 
                leftText={ leftText } 
                isChecked= { isChecked }
                checkedImage={ <Image style={styles.checkedImage} source={require('./img/ic_check_box.png')} /> }    
                unCheckedImage={ <Image style={styles.unCheckedImage} source={require('./img/ic_check_box_outline_blank.png')} /> }
            ></CheckBox>
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
                    title = { title }
                    statusBar = {{ backgroundColor: '#2196f3' }}
                    leftButton = { ViewUtils.getLeftButton(() => this.onBack()) }
                    rightButton = { ViewUtils.getRightButton(rightButtonTitle, () => this.onSave()) }
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
        backgroundColor: '#ddd',
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
        tintColor: '#2196f3'
    },
    unCheckedImage: {
        tintColor: '#2196f3'
    }
});