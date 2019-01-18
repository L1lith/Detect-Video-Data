const fetch = require('./fetch')
const {JSDOM} = require('jsdom')
const request = require('request')
const {join} = require('path')
const {createWriteStream} = require('fs')

async function downloadSub(subData, downloadFolder) {
  const rawHTML = (await fetch(subData.url)).body.toString()
  const subDocument = (new JSDOM(rawHTML)).window.document
  const downloadURL = "https://subscene.com" + subDocument.getElementById('downloadButton').href

  const {body} = await fetch(downloadURL)

  const stream = createWriteStream(join(downloadFolder, subData.title + '.zip'))
  stream.write(body)
  stream.close()
}

module.exports = downloadSub
