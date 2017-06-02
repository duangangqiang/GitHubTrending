/**
 * 通用utils
 */
export default class Utils {

    /**
     * 检查该Item有没有收藏过
     * @param item
     * @param items
     * @returns {boolean}
     */
    static checkFavorite(item, items) {
        for (let i = 0, len = items.length; i< len; i++) {
            if (item.id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }
}
