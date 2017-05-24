import TrendingRepoModel from './TrendingRepoModel';
import StringUtil from './StringUtil';

export default class TrendingUtil {
    static htmlToRepo(responseData) {
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

    static parseRepoBaseInfo(repo, htmlBaseInfo) {
        let urlIndex = htmlBaseInfo.indexOf('<a href="') + '<a href="'.length;
        let url = htmlBaseInfo.slice(urlIndex, htmlBaseInfo.indexOf('">', urlIndex));
        repo.url = url;
        repo.fullName = url.slice(1, url.length);

        repo.description = this.parseContentWithNote(htmlBaseInfo, '<p class="col-9 d-inline-block text-gray m-0 pr-4">', '</p>');
    }

    static parseRepoMeta(repo, metaNoteContent) {
        let content = this.parseContentWithNote(metaNoteContent, '<span class="float-right">', '</span>');
        let metaContent = content.substring(content.indexOf('</svg>') + '</svg>'.length, content.length);
        repo.meta = StringUtil.trim(metaContent);
    }

    static parseRepoLang(repo, metaNoteContent) {
        let content = this.parseContentWithNote(metaNoteContent, 'programmingLanguage">', '</span>');
        repo.language = StringUtil.trim(content);
    }

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
