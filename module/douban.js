module.exports = {
    buildDoubanDigest
}

require('es6-promise').polyfill()
require('isomorphic-fetch')

function buildDoubanDigest (id) {
    return getBookInfo(id).then(buildDigest)
}

function buildDigest ({rating, author, origin_title, image, pages, publisher, alt, title}) {
    let res = []
    if (title) {
        if (alt) {
            res.push(`- [${title}](${alt})`)
        } else {
            res.push(`- ${title}`)
        }
    }
    if (rating) { res.push(`- 评分：${rating.average}/${rating.max}（${rating.numRaters}人给出的平均分）`) }
    if (author) { res.push(`- 作者：${author}`) }
    if (origin_title) { res.push(`- 原著名：${origin_title}`)}
    if (pages) { res.push(`- 页数：${pages}`)}
    if (publisher) { res.push(`- 出版社：${publisher}`)}
    if (image) { res.push('', `![](${image})`)}

    return { pages: Number(pages), title, md: res.join('\n')}
}

function getBookInfo (id) {
    return fetch(`https://api.douban.com/v2/book/${id}`)
        .then(function (res) {
            return res.json()
        })
}