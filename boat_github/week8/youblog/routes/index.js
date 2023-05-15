const express = require('express')
const router = express.Router()
var article = require('../article-db')

router.get('/', function(req, res, next) {
    var fil = req.query.search
    console.log(req.query)
    var filterAns = article.filter(val => (val.title).toLowerCase().includes((fil ? fil : '').toLowerCase()))
    var data = { title: 'Express', article: filterAns }
    res.render('index', data)

})
router.get('/blog/:id', function(req, res, next) {
    if (article.find(article => article.id === req.params.id) ){
        
        res.render('detail', {article: article.find(article => article.id === req.params.id) })
    }
    else res.render('detail', {title: 'Express', article:"madara"})
})
 
module.exports = router