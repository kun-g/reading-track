let should = require('should')
let rfr = require('rfr')

describe("Issue", function () {
    let { buildIssueInfo } = rfr('/module/issue')
    it("buildIssueInfo - normal", function () {
        let issue = {
            title: "卓有成效的管理者",
            body: ''
        }
        return buildIssueInfo(issue)
            .then(function (info) {
                info.should.have.property('milestone')
            })
    })

    it("buildIssueInfo - douban", function () {
        let issue = {
            title: "卓有成效的管理者（豆瓣）",
            body: 'https://book.douban.com/subject/1322025/'
        }
        return buildIssueInfo(issue)
            .then(function (info) {
                info.should.have.property('milestone')
                info.title.should.equal("卓有成效的管理者")
                info.pages.should.equal(177)
                info.body.length.should.above(10)
            })
    })
})

describe("Book", function () {
    describe("Douban", function () {
        let { buildDoubanDigest } = rfr('/module/douban')

        it("buildDoubanDigest", function () {
            return buildDoubanDigest(1322025)
                .then(function (info) {
                    info.should.have.property('pages')
                    info.should.have.property('md')
                })
        })
    })
})