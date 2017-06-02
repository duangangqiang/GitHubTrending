import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';

import Colors from '../constants/Colors';

const starIcon = require('../../res/images/ic_star.png'); // 收藏星星
const unStarIcon = require('../../res/images/ic_unstar_transparent.png'); // 未收藏星星

/**
 * 最热模块单个项目行
 */
export default class PopularCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFavorite: this.props.projectModel.isFavorite, // 是否已经收藏
            favoriteIcon: this.props.projectModel.isFavorite ? starIcon : unStarIcon // 当前显示的图标
        }
    }

    /**
     * 设置state收藏状态
     * @param isFavorite 是否收藏
     */
    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? starIcon : unStarIcon
        });
    }

    componentWillReceiveProps(nextProps) {

        // 如果外部收藏改变,需要使用最新的收藏来设置图标显示
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    /**
     * 点击收藏按钮回调函数
     */
    onPressFavorite() {

        // 点击需要取反
        this.setFavoriteState(!this.state.isFavorite);

        // 触发父组件的函数进行收藏状态保存
        this.props.onFavoritePress(this.props.projectModel.item, !this.state.isFavorite);
    }

    /**
     * 生成关注按钮
     * @returns {XML}
     * @private
     */
    _renderFavoriteButton () {
        return (
            <TouchableOpacity onPress={() => this.onPressFavorite()}>
                <Image style={styles.star} source={this.state.favoriteIcon}/>
            </TouchableOpacity>
        );
    }

    onPress() {
        this.props.onSelect(this.props.projectModel);
    }

    getItem() {
        return this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
    }

    render() {
        const item = this.getItem();
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.onPress()}>
                <View style={styles.box}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.bottom}>
                        <View style={styles.avatar_box}>
                            <Text>Author: </Text>
                            <Image style={styles.avatar} source={{uri: item.owner.avatar_url}}/>
                        </View>
                        <View style={styles.avatar_box}>
                            <Text>Starts: </Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {this._renderFavoriteButton()}
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
        height: 22,
        tintColor: Colors.main
    }
});