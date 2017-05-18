export default class ArrayUtils {

    /**
     * 更新数组,若item已经存在则从数组中将它移除,否则添加进数组
     */
    static updateArray (array, item) {
        for (let i = 0, len = array.length; i < len; i++) {
            let temp = array[i];
            if (temp === item) {
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }

    /**
     * 克隆数组
     */
    static clone (from) {
        if (!from) return [];

        let newArray = [];

        for (let i = 0, len = from.length; i < len; i++) {
            newArray[i] = from[i];
        }
        return newArray;
    }

    /**
     * 判断两个数组的元素是否意义对应
     * @param {*} arr1 第一个数组 
     * @param {*} arr2 第二个数组
     * @return {boolean} 是否相等的结果
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false;
        if (arr1.length !== arr2.length) return false;

        for (let i = 0, l = arr2.length; i < l; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}