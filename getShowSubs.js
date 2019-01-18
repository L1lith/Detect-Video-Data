const fetch = require('./fetch')
const {JSDOM} = require('jsdom')
const levenPercent = require('./levenPercent')

async function getShowSubs(showName, options={}) {
  let {threshold=.75, language="english", filters=[]} = options
  if (typeof language == 'string') language = language.toLowerCase()
  const rawHTML = (await fetch("https://subscene.com/subtitles/title?q="+encodeURIComponent(showName))).body.toString()
  const searchDocument = (new JSDOM(rawHTML)).window.document
  const resultDivs = [...searchDocument.querySelectorAll('.search-result .title a')]
  let results = resultDivs.map(a => ({name: a.textContent, url: "https://subscene.com" + a.href}))
  results.forEach(show => show.likelyness = levenPercent(show.name, showName) >= threshold)
  results = results.filter(show => show.likelyness >= threshold)
  if (results.length < 1) throw new Error("Could not find a matching show")
  const show = results.sort((resultA, resultB) => resultB.likelyness - resultA.likelyness)[0]
  const showHTML = (await fetch(show.url)).body.toString()
  const showDocument = (new JSDOM(showHTML)).window.document
  let subs = [...showDocument.querySelectorAll('.a1')].map(node => node.parentNode)
  if (typeof language == 'string') subs = subs.filter(node => node.querySelector('.l').textContent.toLowerCase().includes(language))
  subs = subs.map(node => ({
    title: node.querySelector('.a1 span:nth-child(2)').textContent.trim(),
    url: "https://subscene.com" + node.querySelector('.a1 > a').href,
    language: node.querySelector('.l').textContent.toLowerCase().trim(),
    uploader: ((node.querySelector('.a5 a') || {}).textContent || "").trim() || null,
    comment: node.querySelector('.a6 div').textContent.trim()
  }))
  return subs
}

module.exports = getShowSubs
