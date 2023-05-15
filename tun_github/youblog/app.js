const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const path = require('path')

// Setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup static path
app.use(express.static(path.join(__dirname, 'public')))

// Config Router

app.use('/', indexRouter)

// app.get('/', (req, res) => {
//     res.send('Hello World')
// })


// ดึงข้อมูล json มาเก็บไว้ในตัวแปร

const article = require('./article-db')

// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

// app.get('/blogapi', (req, res) => {
//     res.json(article)
// })

// // กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด

// app.get('/blog/:id', (req, res) => {
//     res.json(article.find(article => article.id === req.params.id))
// })
app.listen(4000, () => {
    console.log('Start server at port 4000.')
})



