const fetch = require('./fetch')
const {JSDOM} = require('jsdom')
const request = require('request')
const {join, basename} = require('path')
const {createWriteStream} = require('fs')
const mkdirpAsync = require('./mkdirpAsync')

async function downloadSub(subData, downloadFolder, fileName) {
  const rawHTML = (await fetch(subData.url)).body.toString()
  const subDocument = (new JSDOM(rawHTML)).window.document
  const downloadURL = "https://subscene.com" + subDocument.getElementById('downloadButton').href

  const {body} = await fetch(downloadURL)

  const stream = createWriteStream(join(downloadFolder, (basename(fileName || "") || subData.title) + '.zip'))
  stream.write(body)
  stream.close()
}

module.exports = downloadSub
