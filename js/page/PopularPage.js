import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  View
} from 'react-native';

import DataRepository from '../expand/dao/DataRepository';
import NavigationBar from '../common/NavigationBar';

const URL = 'https://api.github.com/search/respositories?q=';
const QUERY_STR = '&sort=stars';

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            result: ''
        };
    }

    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    onLoad() {
        let url = this.getUrl(this.text);
        this.dataRepository.fetchNetRespository(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar 
                    title={'欢迎'}
                    style={{ backgroundColor: '#6495ED' }}
                />
                <Text style={styles.tips} onPress={() => this.onLoad()}
                >获取数据</Text>
                <TextInput style={{height: 40, borderWidth: 1}}
                    onChangeText={text => this.text = text}    
                />
                <Text style={{height: 500}}>获取的数据: {this.state.result}</Text>
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