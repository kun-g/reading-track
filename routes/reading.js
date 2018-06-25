require('es6-promise').polyfill()
require('isomorphic-fetch')
let { buildIssueInfo } = require('../module/issue')

let pagesPerHour = 60
module.exports = (app) => {
  app.post('/reading', (req, res) => {
      const { action, issue } = req.body

      console.log(`[BEGIN] issue updated with action: ${action}`)
      if (action === 'opened') {
        buildIssueInfo(issue, { milestone: 3 })
          .then(function (data) {
            console.log(data)
            let hours = 1
            if (data.pages) {
              hours = Math.ceil(data.pages/pagesPerHour)
              delete data.pages
            }
            setIssueStoryPoint(issue, hours, req.webtaskContext.secrets)
            updateIssueInfo(issue, data, req.webtaskContext.secrets)
          })
      }

      res.json({ message: 'issue updated!' })
    },
  )

  app.get('/reading', (req, res) => {
    const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = req.webtaskContext.secrets

    console.log('[BEGIN]', req.query)
    const title = req.query.title

    let keyword = encodeURIComponent(title.replace(/\s/g, '+'))
    console.log('[KEYWORD]', keyword)

    fetch(`https://api.github.com/search/issues?q=${keyword}%20repo:${REPO_OWNER}/${REPO_NAME}`)
      .then(response => response.json())
      .then(data => {
        console.log('[RESULT]', data)
        if (data.total_count > 0) {
          data.items.forEach(({ url, html_url }) =>
            fetch(`${url}?access_token=${GITHUB_TOKEN}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ state: 'closed' }),
            })
              .then(() => console.log(`[END] issue closed successful! ${html_url}`))
              .catch(err => res.json('error', { error: err })))
          res.json({ message: 'Closed issue successful!' })
        } else {
          console.log('[RESULT]', data)

          fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?access_token=${GITHUB_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
          })
            .then(response => response.json())
            .then(({ url, html_url }) => {
              console.log(`[END] issue created successful! ${html_url}`)
              fetch(`${url}?access_token=${GITHUB_TOKEN}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: 'closed' }),
              })
                .then(() => console.log(`[END] issue closed successful! ${html_url}`))
                .catch(err => res.json('error', { error: err }))
            })
            .catch(err => res.json('error', { error: err }))
        }
        res.json({ error: 'Finished achieve reading item!' })
      })
      .catch(err => res.json('error', { error: err }))
  })

  app.post('/reading-note', (req, res) => {
    const { GITHUB_TOKEN } = req.webtaskContext.secrets

    const title = req.query.title
    const note = req.body.note
    console.log('[BEGIN]', { title, note })

    let keyword = encodeURIComponent(title.replace(/\s/g, '+'))
    console.log('[KEYWORD]', keyword)

    fetch(`https://api.github.com/search/issues?q=${keyword}%20repo:${REPO_OWNER}/${REPO_NAME}%20is:open`)
      .then(response => response.json())
      .then(data => {
        console.log('[RESULT]', data)
        if (data.total_count > 0) {
          data.items.forEach(({ url, html_url }) =>
            fetch(`${url}/comments?access_token=${GITHUB_TOKEN}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ body: `> ${note}` }),
            })
              .then(() => console.log(`[END] added comment successful! ${html_url}`))
              .catch(err => res.json('error', { error: err })))
          res.json({ message: 'Added comment into issue successful!' })
        }
        res.json({ error: 'Not Found!' })
      })
      .catch(err => res.json('error', { error: err }))
  })
}

function updateIssueInfo (issue, data, { GITHUB_TOKEN }) {
  fetch(`${issue.url}?access_token=${GITHUB_TOKEN}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(
    () => console.info(`[END] set milestone successful! ${issue.number}`),
  )
}

function setIssueStoryPoint (issue, point, { ZENHUB_TOKEN, REPO_ID }) {
  let url = 'https://'+`api.zenhub.io/p1/repositories/${REPO_ID}/issues/${issue.number}/estimate?access_token=${ZENHUB_TOKEN}`
  let body = JSON.stringify({ estimate: point })
  let headers = { 'Content-Type': 'application/json' }
  fetch(url, { method: 'PUT', headers , body }).then(
    () => console.log(`[END] Set estimate successful! ${issue.id}`),
    (e) => console.error(`[END] Failed to set estimate! ${issue.id}`, e),
  )
}