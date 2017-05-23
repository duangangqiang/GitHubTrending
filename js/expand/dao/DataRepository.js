import {
    AsyncStorage
} from 'react-native';

export default class DataRepository {

    /**
     * 根据url加载GitHub的项目
     * @param url 加载项目的链接
     * @returns {Promise}
     */
    fetchRepository(url) {
        return new Promise((resolve, reject) => {

            // 获取本地的数据
            this.fetchLocalRepository(url)
                .then(result => {
                    if (result) {
                        resolve(result)
                    } else {
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(() => {
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(e => {
                            reject(e);
                        })
                })
        });
    }

    /**
     * 获取本地项目数据
     * @param url 获取项目的地址
     * @returns {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * 获取网络的项目数据
     * @param url 请求的地址
     * @returns {Promise}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(result => {
                    if (!result) {
                        reject(new Error('responseData is null'));
                        return;
                    }
                    resolve(result.items);
                    DataRepository.saveRepository(url, result.items);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    /**
     * 保存数据到缓存中
     * @param url 请求地址
     * @param items 结果数据
     * @param callBack 保存完执行的回调函数
     */
    static saveRepository(url, items, callBack) {
        if (!url || !items) {
            return;
        }
        let wrapData = {
            items: items,
            update_date: new Date().getTime()
        };
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
    }

    /**
     * 判断数据是否过时
     * @param {*} longTime 数据的时间戳
     * @returns {Boolean} 是否过期
     */
    static checkData(longTime) {
        let cDate = new Date(),
            tDate = new Date();

        tDate.setTime(longTime);

        if (cDate.getMonth() !== tDate.getMonth()) {
            return false;
        }

        if (cDate.getDay() !== tDate.getDay()) {
            return false;
        }

        return cDate.getHours() === tDate.getHours();
    }
}