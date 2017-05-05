import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ListView,
    RefreshControl
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

import NavigationBar from './NavigationBar';
const data = {
  result: [
    {
      email: 'abc.163.com',
      fullName: 'abc'
    },
    {
      email: 'bcv.163.com',
      fullName: 'bcv'
    },
    {
      email: 'hahah.163.com',
      fullName: 'hahah'
    },
    {
      email: 'lololo.163.com',
      fullName: 'lololo'
    },
    {
      email: 'yun.163.com',
      fullName: 'yun'
    },
    {
      email: 'nihao.163.com',
      fullName: 'nihao'
    },
    {
      email: 'woqu.163.com',
      fullName: 'woqu'
    },
    {
      email: 'diaobaobao.163.com',
      fullName: 'diaobaobao'
    },
    {
      email: 'oune.163.com',
      fullName: 'oune'
    },
    {
      email: 'bcv.163.com',
      fullName: 'bcv'
    },
    {
      email: 'hahah.163.com',
      fullName: 'hahah'
    },
    {
      email: 'lololo.163.com',
      fullName: 'lololo'
    },
    {
      email: 'yun.163.com',
      fullName: 'yun'
    },
    {
      email: 'nihao.163.com',
      fullName: 'nihao'
    },
    {
      email: 'woqu.163.com',
      fullName: 'woqu'
    },
    {
      email: 'diaobaobao.163.com',
      fullName: 'diaobaobao'
    },
    {
      email: 'oune.163.com',
      fullName: 'oune'
    }
  ]
}
export default class ListViewTest extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading: false
        };
        this.onLoad();
    }

    renderRow (item) {
        return <View style={ styles.row }>
            <TouchableOpacity 
                    onPress= { () => {
                        this.toast.show('你单击了: ' + item.fullName, DURATION.LENGTH_LONG)
                    } }
                >
                <Text style={ styles.tips }>{ item.fullName }</Text>
                <Text style={ styles.tips }>{ item.email }</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={ styles.line }></View>
    }

    renderFooter () {
        return <Image 
            style={{ width: 400, height: 100 }}
            source={{uri: 'http://static.mukewang.com/static/img/common/logo.png?t=2.3'}
        }></Image>
    }

    onLoad () {
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 10000);
    }

    render() {
        return (
            <View style={ styles.container }>
                <NavigationBar 
                    title={'ListView'}
                    style={{
                        backgroundColor: "#EE6363"
                    }}
                    statusBar = {{
                        backgroundColor: "#EE6363",
                        hidden: true
                    }}
                />
                <ListView 
                    dataSource={ this.state.dataSource }
                    renderRow = { (item) => this.renderRow(item) }
                    renderSeparator = { () => this.renderSeparator() }
                    renderFooter = { () => this.renderFooter() }
                    refreshControl = { 
                        <RefreshControl refreshing = { this.state.isLoading }
                            onRefresh = { () => this.onLoad() }
                        />
                    }
                ></ListView>
                <Toast ref={toast => { this.toast = toast }}></Toast>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    text: {
        fontSize: 22,
    },
    row: {
        height: 50
    },
    line: {
        height: 1,
        backgroundColor: '#333'
    }
});