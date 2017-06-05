export default class TrendingRepoModel {
    constructor(fullName, url, description, language, meta, contributors, contributorsUrl) {
        this.id = this.fullName; // 此处添加id属性用于兼容,这是最简单的方法
        this.fullName = fullName;
        this.url = url;
        this.description = description;
        this.language = language;
        this.meta = meta;
        this.contributors = contributors;
        this.contributorsUrl = contributorsUrl;
    }
}
