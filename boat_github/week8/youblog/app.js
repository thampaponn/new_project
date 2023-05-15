const express = require('express')

const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

app.listen(3000, () => {
  console.log('Start server at port 3000.')
})
// ดึงข้อมูล json มาเก็บไว้ในตัวแปร

const article = require('./article-db')

// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

app.get('/blogapi', (req, res) => {
  res.json(article)
})

// กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด

app.get('/blogapi/:id', (req, res) => {
  if(article.find(article => article.id === req.params.id))
    res.json(article.find(article => article.id === req.params.id))
  else{
    res.send("madara")
  }
})

const path = require('path')

// Setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup static path
app.use(express.static(path.join(__dirname, 'public')))

// Config Router
const indexRouter = require('./routes/index')

app.use('/', indexRouter)