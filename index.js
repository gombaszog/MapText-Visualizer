const express = require('express')
const path = require('path')
const fs = require("fs")
const app = express()
const port = 5000

const generator = require('./controllers/generator.js')

app.set('view engine', 'ejs')
app.use(express.static('assets'))


app.get('/', (req, res) => {
    let svgUrl = '/result.svg'
    if(req.query.lang == 'sk'){
        svgUrl = '/resultSK.svg'
    }

    res.render('home', {url: svgUrl})
})

app.get('/regenerateHU', (req, res) => {
    let info = generator.generateSvgHU()
    console.log(info)
    res.redirect('/')
})

app.get('/regenerateSK', (req, res) => {
    let info = generator.generateSvgSK()
    console.log(info)
    res.redirect('/?lang=sk')
})

app.listen(port, () => console.log(`App listening on port ${port}!`))