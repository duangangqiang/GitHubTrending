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
}