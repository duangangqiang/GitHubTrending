export default class TrendingRepoModel {
  constructor(fullName,url,description,language,meta,contributors,contributorsUrl) {
    this.full_name = fullName;
    this.url = url;
    this.description = description;
    this.language = language;
    this.meta = meta;
    this.contributors = contributors;
    this.contributorsUrl = contributorsUrl;
  }
}
