import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';

import HTMLView from 'react-native-htmlview';

/**
 * Trending页面的单个项目
 */
export default class TrendingCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;

        // 加一个p利于设置样式
        let description = '<p>' + data.description + '</p>';
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onSelect(data)}>
                <View style={styles.box}>
                    <Text style={styles.title}>{data.fullName}</Text>
                    <HTMLView value={description}
                              onLinkPress={(url) => {}}
                              stylesheet={{
                                  p: styles.description,
                                  a: styles.description
                              }}
                    />
                    <Text style={styles.description}>{data.meta}</Text>
                    <View style={styles.bottom}>
                        <View style={styles.avatar_box}>
                            <Text style={styles.description}>Build By: </Text>
                            {data.contributors.map((result, index, arr) => {
                                return <Image style={styles.avatar}
                                              key={index}
                                              source={{uri: arr[index]}}/>
                            })}
                        </View>
                        <Image style={styles.star} source={require('../../res/images/ic_star.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    box: {
        backgroundColor: '#fff',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#ddd',
        shadowColor: 'gray', // ios
        shadowOffset: {width: 0.5, height: 0.5}, // ios
        shadowOpacity: 0.4, // ios
        shadowRadius: 1, // ios
        elevation: 2 // android
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        height: 22,
        width: 22
    },
    avatar_box: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    star: {
        width: 22,
        height: 22
    }
});