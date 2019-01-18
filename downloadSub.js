const fetch = require('./fetch')
const {JSDOM} = require('jsdom')
const request = require('request')
const {join, basename, extname} = require('path')
const {createWriteStream} = require('fs')
const mkdirpAsync = require('./mkdirpAsync')
const AdmZip = require('adm-zip')

async function downloadSub(subData, downloadFolder, fileName) {
  const rawHTML = (await fetch(subData.url)).body.toString()
  const subDocument = (new JSDOM(rawHTML)).window.document
  const downloadURL = "https://subscene.com" + subDocument.getElementById('downloadButton').href

  const {body} = await fetch(downloadURL)

  const zip = new AdmZip(body)
  const subEntry = zip.getEntries()[0]
  const subBuffer = subEntry.getData()
  const subDestination = join(downloadFolder, (basename(fileName || "") || subData.title) + extname(subEntry.entryName))
  const stream = createWriteStream(subDestination)
  stream.write(subBuffer)
  stream.close()
}

module.exports = downloadSub
