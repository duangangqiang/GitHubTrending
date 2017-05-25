import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

import NavigationBar from '../js/common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../js/expand/dao/DataRepository';

const URL = 'https://github.com/trending/';

export default class TrendingTest extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            result: ''
        }
    }

    onLoad() {
        let url = URL + this.text;
        this.dataRepository.fetchRepository(url)
            .then(result => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                });
            })
    }

    render() {
        return (
          <View style={styles.container}>
                <NavigationBar title={'Trending测试'}
                    style={{backgroundColor: '#6495ED'}} />
                
                <TextInput style={styles.textInput}
                           onChangeText={text => this.text = text} />
                <View style={styles.textBox}>
                    <Text style={styles.text}
                          onPress={() => this.onLoad()}>加载</Text>
                </View>

              <Text style={{flex: 1}}>{this.state.result}</Text>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontSize: 20,
        margin: 5
    },
    textInput: {
        borderWidth: 1,
        height: 40,
        margin: 6
    },
    textBox: {
        flexDirection: 'row'
    }
});