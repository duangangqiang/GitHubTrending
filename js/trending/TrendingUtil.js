import TrendingRepoModel from './TrendingRepoModel';
import StringUtil from './StringUtil';

/**
 * 解析趋势页面的HTML为数据对象
 */
export default class TrendingUtil {

    /**
     * 解析html为项目
     * @param responseData html响应
     * @returns {Array}
     */
    static htmlToRepo(responseData) {

        // 找到项目列表
        responseData = responseData.substring(responseData.indexOf('<li class="repo-list-item'),
            responseData.indexOf('</ol>')).replace(/\n/, '');
        let repos = [];
        let splitWithH3 = responseData.split('<h3');
        splitWithH3.shift();

        for (let i = 0; i < splitWithH3.length; i++) {
            let repo = new TrendingRepoModel();
            let html = splitWithH3[i];

            this.parseRepoBaseInfo(repo, html);

            let metaNoteContent = this.parseContentWithNote(html, 'class="f6 text-gray mt-2">', '</li>');
            this.parseRepoMeta(repo, metaNoteContent);
            this.parseRepoLang(repo, metaNoteContent);
            this.parseRepoContributors(repo, metaNoteContent);
            repos.push(repo);
        }
        return repos;
    }

    /**
     * 解析节点内的内容
     * @param htmlStr html片段
     * @param startFlag 开始标志位
     * @param endFlag 结束标志位
     * @returns {*}
     */
    static parseContentWithNote(htmlStr, startFlag, endFlag) {
        let noteStar = htmlStr.indexOf(startFlag);
        if (noteStar === -1) {
            return '';
        } else {
            noteStar += +startFlag.length;
        }

        let noteEnd = htmlStr.indexOf(endFlag, noteStar);
        let content = htmlStr.substring(noteStar, noteEnd);
        return StringUtil.trim(content)
    }

    /**
     * 解析项目基本信息
     * @param repo 目标项目数据对象
     * @param htmlBaseInfo html片段
     */
    static parseRepoBaseInfo(repo, htmlBaseInfo) {
        let urlIndex = htmlBaseInfo.indexOf('<a href="') + '<a href="'.length;
        let url = htmlBaseInfo.slice(urlIndex, htmlBaseInfo.indexOf('">', urlIndex));
        repo.url = url; // url
        repo.fullName = url.slice(1, url.length); // fullName
        repo.id = repo.fullName; // 此处添加id属性用于兼容,这是最简单的方法
        repo.description = this.parseContentWithNote(htmlBaseInfo, '<p class="col-9 d-inline-block text-gray m-0 pr-4">', '</p>');
    }

    /**
     * 解析项目的星星数
     * @param repo 目标项目数据对象
     * @param metaNoteContent
     */
    static parseRepoMeta(repo, metaNoteContent) {
        let content = this.parseContentWithNote(metaNoteContent, '<span class="float-right">', '</span>');
        let metaContent = content.substring(content.indexOf('</svg>') + '</svg>'.length, content.length);
        repo.meta = StringUtil.trim(metaContent);
    }


    /**
     * 解析项目语言
     * @param repo 目标项目数据对象
     * @param metaNoteContent
     */
    static parseRepoLang(repo, metaNoteContent) {
        let content = this.parseContentWithNote(metaNoteContent, 'programmingLanguage">', '</span>');
        repo.language = StringUtil.trim(content);
    }

    /**
     * 解析项目贡献者
     * @param repo
     * @param htmlContributors
     */
    static parseRepoContributors(repo, htmlContributors) {
        htmlContributors = this.parseContentWithNote(htmlContributors, 'Built by', '</a>');
        let splitWitSemicolon = htmlContributors.split('"');
        repo.contributorsUrl = splitWitSemicolon[1];
        let contributors = [];
        for (let i = 0; i < splitWitSemicolon.length; i++) {
            let url = splitWitSemicolon[i];
            if (url.search('http') !== -1) {
                contributors.push(url);
            }
        }
        repo.contributors = contributors;
    }
}
