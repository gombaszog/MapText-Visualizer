const fs = require("fs")
const mover = require('../controllers/move.js')

const settlements = require("../json/setlements.json").result
const villages = require("../json/villages.json")
const colors = require('../json/parameters.json').colors
const districts = require('../json/parameters.json').districts

const svgBase = fs.readFileSync("./assets/rajz.svg", "utf8")

/* PARAMETERS */

const magn = 40
const baseLat = 2350 // fuggoleges
const baseLng = 650 // vizszintes
let margin = 0.25

module.exports = {
  generateSvgHU: function () {
    try {
      const svgDefault = getSvgText('hu')
      const result = mover.makeOffsets(svgDefault)
      const dataSet = generateFromDataset(result)
      fs.writeFileSync("./assets/result.svg", svgBase.replace("%%text%%", dataSet), "utf8")

      console.log('Generating HU -> success')
      return {
        error: null,
        success: true
      }
    } catch (err) {
      console.log(`Error: ${err}`)
      return {
        error: err,
        success: false
      }
    }

  },

  generateSvgSK: function () {
    try {
      const svgDefault = getSvgText('sk')
      const result = mover.makeOffsets(svgDefault)
      const dataSet = generateFromDataset(result)
      fs.writeFileSync("./assets/resultSK.svg", svgBase.replace("%%text%%", dataSet), "utf8")

      console.log('Generating SK -> success')
      return {
        error: null,
        success: true
      }
    } catch (err) {
      console.log(`Error: ${err}`)
      return {
        error: err,
        success: false
      }
    }

  }

}

return module.exports


function getSvgText(lang) {
  let container = []
  let i = 0
  for (var j = 0; j < villages.length; j++) {
    if (villages[j].country === "SK") {
      var coords = getCoordinates(villages[j].name)
      var fontSize = genFontSize(villages[j].count)
      let content = new Object()
      content = {
        fontSize: fontSize,
        name: lang === 'sk' ? coords.skName : coords.huName,
        id: j,
        color: coords.color
      }
      content['xoffsetleft'] = (content['name'].length * content['fontSize'] / 1.8) / 1.7
      content['x1'] = coords.x - margin - content['xoffsetleft']
      content['y1'] = coords.y - (1.25 * content['fontSize'] / 1.8) - margin
      content['x2'] = coords.x + (content['name'].length * content['fontSize'] / 1.8) + margin - content['xoffsetleft']
      content['y2'] = coords.y + margin


      container.push(content)
      i++
    }
  }

  return container.sort((a, b) => (a.fontSize < b.fontSize) ? 1 : -1)
}


function generateFromDataset(dataSet) {
  let container = ""
  for (let i = 0; i < dataSet.length; i++) {
    container += genText({
      color: dataSet[i].color,
      size: dataSet[i].fontSize,
      name: dataSet[i].name,
      x: dataSet[i].x1,
      y: dataSet[i].y2,
      xoffsetleft: dataSet[i].xoffsetleft,
      id: i
    })
  }
  return container
}

function getCoordinates(name) {
  for (var i = 0; i < settlements.length; i++) {
    if (settlements[i].nameHU === name) {
      return {
        x: settlements[i].lng * magn - baseLng,
        y: baseLat - settlements[i].lat * magn * 1.1,
        skName: settlements[i].nameSK,
        huName: settlements[i].nameHU,
        color: getColor(settlements[i].districtId)
      }
    }
  }
  console.log("could not localize " + name)
  return {
    x: 22.6 * magn - baseLng,
    y: baseLat - 48.4 * magn * 1.1,
    color: "#000080"
  }
}

function genFontSize(count) {
  return (Math.log(count) / 1.3 + 1) * magn * 0.01
}


function getColor(districtId) {
  if (typeof districts[districtId] === "number") {
    districts[districtId]++
  }
  // console.log("color for " + districtId + ": " + (colors[districtId] || "#000080"))

  if (colors[districtId])
    return (colors[districtId].color)

  return "#000080"
}

function genText(config) {
  return `<text xml:space="preserve" style="font-style:normal; font-weight:normal; font-size:${config.size}px; line-height:1.25; font-family:sans-serif; letter-spacing:0px; word-spacing:0px; fill:${config.color}; fill-opacity:1; stroke:none; stroke-width:0.26458332;" x="${config.x + margin + config.xoffsetleft}" y="${config.y + margin}" id="${config.id}">
    <tspan sodipodi:role="line" id="span${config.id}" x="${config.x + margin + config.xoffsetleft}" y="${config.y + margin}" style="stroke-width:0.26458332; text-anchor:middle; text-align:center">${config.name}</tspan>
  </text>`
  // <rect x="${config.x - config.testx/1.7}" y="${ config.y - config.testy}" width="${config.testx}px" height="${config.testy}px" style="stroke-width:0.1px;stroke:rgb(0,0,0);fill:none;" />
}
