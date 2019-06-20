let tried, time, globalJson

module.exports = {
  makeOffsets: function (data) {
    time = Date.now()
    tried = 0
    globalJson = []
    testIntersect(data)
    return globalJson
  }

}

return module.exports

function doOverlap(a, b) {
  return (a.x1 <= b.x2 &&
    b.x1 <= a.x2 &&
    a.y1 <= b.y2 &&
    b.y1 <= a.y2)

}

function testIntersect(jsonData) {
  let globCount = 0;
  for (let i = 0; i < jsonData.length; i++) {
    for (let j = i + 1; j < jsonData.length; j++) {
      if (i === j) {
        continue
      }
      let overlap
      if (doOverlap({
          x1: jsonData[i].x1,
          y1: jsonData[i].y1,
          x2: jsonData[i].x2,
          y2: jsonData[i].y2
        }, {
          x1: jsonData[j].x1,
          y1: jsonData[j].y1,
          x2: jsonData[j].x2,
          y2: jsonData[j].y2
        })) {
        overlap = 1
        globCount++
      } else {
        overlap = 0
      }
      let counter = 0
      while (overlap === 1) {
        counter++
        let xrand = Math.random() / 20 // min 20 is req.
        let yrand = Math.random() / 20 // min 20 is req.
        let testCase = Math.random()
        if (testCase <= 0.25) {
          jsonData[j].x1 += xrand
          jsonData[j].y1 += yrand
          jsonData[j].x2 += xrand
          jsonData[j].y2 += yrand
        } else if (testCase <= 0.50) {
          jsonData[j].x1 += xrand
          jsonData[j].y1 -= yrand
          jsonData[j].x2 += xrand
          jsonData[j].y2 -= yrand
        } else if (testCase <= 0.75) {
          jsonData[j].x1 -= xrand
          jsonData[j].y1 += yrand
          jsonData[j].x2 -= xrand
          jsonData[j].y2 += yrand
        } else {
          jsonData[j].x1 -= xrand
          jsonData[j].y1 -= yrand
          jsonData[j].x2 -= xrand
          jsonData[j].y2 -= yrand
        }
        if (doOverlap({
            x1: jsonData[i].x1,
            y1: jsonData[i].y1,
            x2: jsonData[i].x2,
            y2: jsonData[i].y2
          }, {
            x1: jsonData[j].x1,
            y1: jsonData[j].y1,
            x2: jsonData[j].x2,
            y2: jsonData[j].y2
          }) == false) {
          {
            overlap = 0;
            //console.log(`killed overlap ${i} - ${j} with ${counter} moves.`)
          }
        }
      }
    }
  }

  if (globCount == 0 && tried < 5) {
    tried++
    //console.log(`${globCount} - retrying ${tried}`)
    testIntersect(jsonData)
  } else if (globCount > 0) {
    tried = 0
    //console.log(globCount)
    testIntersect(jsonData)
  } else if (tried === 5) {
    //console.log(`${Math.floor( ( Date.now() - time ) / 1000, 2)}s`);
    globalJson = jsonData
  }
}
