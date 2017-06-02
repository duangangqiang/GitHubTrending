import React from 'react';
import {AsyncStorage} from 'react-native';

// 用于标记是最热模块的收藏还是趋势模块的收藏
const FAVORITE_KEY_PREFIX = 'favorite_';

/**
 * 用于管理收藏的Dao
 */
export default class FavoriteDao {
    constructor(flag) {
        this.flag = flag;

        // 拼接一个key存储所有的收藏key
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    /**
     * 收藏项目,保存收藏的项目
     * @param key 项目id 或者是名称
     * @param value 收藏的项目
     */
    addFavoriteItem(key, value) {
        AsyncStorage.setItem(key, value, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key, true);
            }
        });
    }

    /**
     * 取消收藏,移除已经收藏的项目
     * @param key 要移除的key
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        });
    }

    /**
     * 更新Favorite key集合
     * @param key 当前key
     * @param isAdd 是否添加
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [], index;
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }

                index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        });
    }

    /**
     * 获取所有已经收藏的项目对应的key
     * @returns {Promise}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }
}