import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  View,
  ListView
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import DataRepository from '../expand/dao/DataRepository';
import NavigationBar from '../common/NavigationBar';
import RepositoryCell from '../common/RepositoryCell';

const URL = 'https://api.github.com/search/repositories?q=';
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
                    title={'最热项目'}
                    style={{ backgroundColor: '#6495ED' }}
                />
                <ScrollableTabView
                    renderTabBar={() => <ScrollableTabBar/>}
                >
                    {/*<ReactPage tabLabel="React" />
                    <FlowPage tabLabel="Flow" />
                    <JestPage tabLabel="Jest" />*/}
                    <PopularTab tabLabel="JAVA">JAVA</PopularTab>
                    <PopularTab tabLabel="C">C</PopularTab>
                    <PopularTab tabLabel="ios">C#</PopularTab>
                </ScrollableTabView>
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

class PopularTab extends Component {
     constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }

    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let url = this.getUrl(this.props.tabLabel);
        this.dataRepository.fetchNetRespository(url)
            .then(result => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    renderRow(data) {
        return <RepositoryCell data={data} />;
    }

    render() {
        return <View>
            <ListView dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
            ></ListView>
        </View>
    }
}