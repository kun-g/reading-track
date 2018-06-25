require('es6-promise').polyfill()
require('isomorphic-fetch')
let { buildDoubanDigest } = require('./douban')

module.exports = {
    buildIssueInfo
}

function buildIssueInfo (issue, { milestone } = {}) {
    milestone = milestone || 1

    return new Promise(function (resolve) {
        return resolve({ milestone })
    })
    .then(function (data) {
        if (issue.body.startsWith('https://book.douban.com')) {
            let id = issue.body.split('/').filter(e => e.length).pop()
            return buildDoubanDigest(id)
                .then(function ({pages, title, md}) {
                    data.pages = pages
                    data.body = md
                    data.title = title
                    return data
                })
        } else {
            return data
        }
    })
}