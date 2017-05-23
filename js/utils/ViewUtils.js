import React from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default class ViewUtils {
    static getLeftButton(callBack) {
        return (
            <TouchableOpacity onPress={callBack}>
                <Image style={{width: 26, height: 26, tintColor: '#fff'}}
                       source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
        );
    }

    static getRightButton(rightButtonTitle, callBack) {
        return (
            <TouchableOpacity onPress={callBack}>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 20, color: '#fff'}}>{rightButtonTitle}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}