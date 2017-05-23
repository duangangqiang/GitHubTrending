import React from 'react';
import {AsyncStorage} from 'react-native';

import keys from '../../../res/data/keys.json';

export const FLAG_LANGUAGE = {
    flag_language: 'flag_language_language',
    flag_key: 'flag_language_key'
};

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    /**
     * 加载要显示的语言列表
     * @returns {Promise}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (result) {
                        try {
                            resolve(JSON.parse(result));
                        } catch (e) {
                            reject(e)
                        }
                    } else {
                        let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : null;
                        this.save(data);
                        resolve(data);
                    }
                }
            });
        });
    }

    /**
     * 保存显示的语言列表
     * @param data 语言列表数据
     * @param errorCallBack 错误回调
     * @returns null
     */
    save(data, errorCallBack) {
        AsyncStorage.setItem(this.flag, JSON.stringify(data), errorCallBack)
    }
}