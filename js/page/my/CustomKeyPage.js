import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import ArrayUitls from '../../utils/ArrayUtils';
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.changeValues = [];
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
        this.loadData();
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
        } else {
            this.languageDao.save(this.state.dataArray);
            this.props.navigator.pop();
        }
    }

    onClick(data) {
        data.checked = !data.checked;
        ArrayUitls.updateArray(this.changeValues, data);
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
        return (
            <CheckBox 
                style={styles.checkbox} 
                onClick={() => this.onClick(data)} 
                leftText={ leftText } 
                isChecked= { data.checked }
                checkedImage={ <Image style={styles.checkedImage} source={require('./img/ic_check_box.png')} /> }    
                unCheckedImage={ <Image style={styles.unCheckedImage} source={require('./img/ic_check_box_outline_blank.png')} /> }
            ></CheckBox>
        );
    }

    render() {
        let rightButton = <TouchableOpacity onPress={() => this.onSave()}>
            <View style={styles.saveBtnBox}>
                <Text style={styles.saveBtn}>保存</Text>
            </View>
        </TouchableOpacity>;
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title = {'自定义标签'}
                    statusBar = {{ backgroundColor: '#2196f3' }}
                    leftButton = { ViewUtils.getLeftButton(() => this.onSave()) }
                    rightButton = { rightButton }
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
    saveBtn: {
        fontSize: 20,
        color: '#fff'
    },
    saveBtnBox: {
        margin: 10
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