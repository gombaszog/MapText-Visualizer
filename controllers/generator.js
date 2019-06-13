const fs = require("fs")

const settlements = require("../json/setlements.json").result
const villages = require("../json/villages.json")
const colors = require('../json/parameters.json').colors
const districts = require('../json/parameters.json').districts

const svgBase = fs.readFileSync("./assets/rajz.svg", "utf8")

/* PARAMETERS */

const magn = 40
const baseLat = 2350 // fuggoleges
const baseLng = 650 // vizszintes

module.exports = {
	generateSvgHU: function () {
		let container = getSvgText('hu')
		fs.writeFileSync("./assets/result.svg", svgBase.replace("%%text%%", container), "utf8")
		return 'Generating HU -> success'
	},

	generateSvgSK: function () {
		let container = getSvgText('sk')
		fs.writeFileSync("./assets/resultSK.svg", svgBase.replace("%%text%%", container), "utf8")
		return 'Generating SK -> success'
	}

}

return module.exports


function getSvgText(lang) {
	let container = ""
	for (var j = 0; j < villages.length; j++) {
		if (villages[j].country === "SK") {
			var coords = getCoordinates(villages[j].name)
			var fontSize = genFontSize(villages[j].count)
			container += genText({
				color: coords.color,
				size: fontSize,
				name: lang === 'sk' ? coords.skName : coords.huName,
				x: coords.x,
				y: coords.y,
				id: j
			})
		}
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
	return `<text xml:space="preserve" style="font-style:normal; font-weight:normal; font-size:${config.size}px; line-height:1; font-family:sans-serif; letter-spacing:0px; word-spacing:0px; fill:${config.color}; fill-opacity:1; stroke:none; stroke-width:0.26458332;" x="${config.x}" y="${config.y}" id="text${config.id}">${config.name}</text>
	`
}