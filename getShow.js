const fetch = require('./fetch')
const {JSDOM} = require('jsdom')
const {join} = require('path')
const mkdirpAsync = require('./mkdirpAsync')
const {writeFile, unlink} = require('mz/fs')

const levenPercent = require('./levenPercent')

const defaultMaxCacheAge = 1000 * 60 * 60 * 24 * 7 // 1 Week default max cache age
const cacheDir = join(__dirname, 'showSubCache')

async function getShow(showName, options={}) {
  await mkdirpAsync(cacheDir)
  let {threshold=.75, language="english", filters=[], maxCacheAge=defaultMaxCacheAge} = options
  if (typeof language == 'string') language = language.toLowerCase()
  const cachePath = join(cacheDir, showName + '.json')
  let cachedData = null
  try {
    cachedData = require(cachePath)
  } catch(error) {}
  if (cachedData !== null) {
    const timeSinceCached = (new Date()).getTime() - new Date(cachedData.saved).getTime()
    if (timeSinceCached > maxCacheAge) {
      await unlink(cachePath)
    } else {
      if (typeof language == 'string') cachedData.subs = cachedData.subs.filter(sub => sub.language.toLowerCase().includes(language))
      return cachedData
    }
  }
  if (typeof language == 'string') language = language.toLowerCase()
  const rawHTML = (await fetch("https://subscene.com/subtitles/title?q="+encodeURIComponent(showName))).body.toString()
  const searchDocument = (new JSDOM(rawHTML)).window.document
  const resultDivs = [...searchDocument.querySelectorAll('.search-result .title a')]
  let results = resultDivs.map(a => ({name: a.textContent, url: "https://subscene.com" + a.href}))
  results.forEach(show => show.likelyness = levenPercent(show.name.toLowerCase(), showName.toLowerCase()))
  results = results.filter(show => show.likelyness >= threshold)
  if (results.length < 1) return null
  const show = results.sort((resultA, resultB) => resultB.likelyness - resultA.likelyness)[0]
  const showHTML = (await fetch(show.url)).body.toString()
  const showDocument = (new JSDOM(showHTML)).window.document
  let subs = [...showDocument.querySelectorAll('.a1')].map(node => node.parentNode)
  subs = subs.map(node => ({
    title: node.querySelector('.a1 span:nth-child(2)').textContent.trim(),
    url: "https://subscene.com" + node.querySelector('.a1 > a').href,
    language: node.querySelector('.l').textContent.toLowerCase().trim(),
    uploader: ((node.querySelector('.a5 a') || {}).textContent || "").trim() || null,
    comment: node.querySelector('.a6 div').textContent.trim()
  }))
  const output = {saved: (new Date()).toDateString(), subs, showName, likelyness: show.likelyness}
  await writeFile(cachePath, JSON.stringify(output))
  if (typeof language == 'string') output.subs = output.subs.filter(sub => sub.language.toLowerCase().includes(language))
  return output
}

module.exports = getShow
