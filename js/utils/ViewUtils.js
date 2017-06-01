import React from 'react';
import {
    Image,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class ViewUtils {
    static getLeftButton(callBack) {
        return (
            <TouchableOpacity onPress={callBack}>
                <Image style={styles.leftImage}
                       source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
        );
    }

    static getRightButton(rightButtonTitle, callBack) {
        return (
            <TouchableOpacity onPress={callBack}>
                <View style={{margin: 10}}>
                    <Text style={styles.rightText}>{rightButtonTitle}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    leftImage: {
        width: 26,
        height: 26,
        marginLeft: 5,
        tintColor: '#fff'
    },
    rightText: {
        fontSize: 20,
        color: '#fff'
    }
});