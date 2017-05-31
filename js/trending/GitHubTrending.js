import TrendingUtil from './TrendingUtil';
/**
 * 抓取GitHub的Trending页面的数据
 */
export default class GitHubTrending {
    GitHubTrending() {//Singleton pattern
        if (typeof GitHubTrending.instance === 'object') {
            return GitHubTrending.instance;
        }
        GitHubTrending.instance = this;
    }

    fetchTrending(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.text())
                .catch((error) => {
                    reject(error);
                }).then((responseData) => {
                try {
                    resolve(TrendingUtil.htmlToRepo(responseData));
                } catch (e) {
                    reject(e);
                }
            }).done();
        });
    }
}
