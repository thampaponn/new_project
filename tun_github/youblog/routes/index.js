const express = require('express')
const router = express.Router()
var article = require('../article-db')

router.get('/', function (req, res, next) {
    var data = {
        article: article.filter(search => {
            if (!req.query.search) {
                return search
            } else {

                return search.title.includes(req.query.search)
            }
        })
    }
    res.render('index', data)
    console.log(data.article)

})
router.get('/blog/:id', function (req, res, next) {
    if (article.find(article => article.id === req.params.id)) {
        let data = { article: article.find(article => article.id === req.params.id) }
        res.render('detail', data)
    } else {
        res.send('ไม่พบบทความ')
    }
})

module.exports = router