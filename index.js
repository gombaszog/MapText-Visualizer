const express = require('express')
const path = require('path')
const fs = require("fs")
const app = express()
const port = 5000

const generator = require('./controllers/generator.js')

app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.json());


app.get('/', (req, res) => {
  let svgUrl = '/result.svg'
  let lang = 'HU'
  if (req.query.lang == 'sk') {
    svgUrl = '/resultSK.svg'
    lang = 'SK'
  }

  let getSvg = fs.readFileSync(`./assets${svgUrl}`, 'utf-8')

  res.render('home', {
    url: svgUrl,
    data: getSvg,
    lang: lang
  })
})

app.get('/regenerateHU', (req, res) => {
  res.json(generator.generateSvgHU())
})

app.get('/regenerateSK', (req, res) => {
  res.json(generator.generateSvgSK())
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
