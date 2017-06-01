import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';

/**
 * 最热模块单个项目行
 */
export default class PopularCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;

        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onSelect(data)}>
                <View style={styles.box}>
                    <Text style={styles.title}>{data.full_name}</Text>
                    <Text style={styles.description}>{data.description}</Text>
                    <View style={styles.bottom}>
                        <View style={styles.avatar_box}>
                            <Text>Author: </Text>
                            <Image style={styles.avatar} source={{uri: data.owner.avatar_url}}/>
                        </View>
                        <View style={styles.avatar_box}>
                            <Text>Starts: </Text>
                            <Text>{data.stargazers_count}</Text>
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