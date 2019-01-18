const getShow = require('./getShow')
const getDataFromPath = require('./getDataFromPath')
const levenPercent = require('./levenPercent')

async function findSubtitle(showName, episodeNumber, options={}) {
  const {episodeThreshold=0.2, showThreshold, language} = options
  if (typeof showName != 'string' || showName.length < 1) throw new Error("You must supply a show name")
  if (episodeNumber === null || !isFinite(episodeNumber)) throw new Error("You must supply a episode number")
  const show = await getShow(showName, {threshold: showThreshold, language})
  if (show === null) return null
  const subNameGuess = show.showName + ' - ' + (episodeNumber < 10 ? "0" : "") + episodeNumber
  console.log(subNameGuess)
  show.subs.forEach(sub => {
    sub.likelyness = levenPercent(sub.title.replace(/\[[a-z0-9]*\]/gi, '').trim(), subNameGuess)
  })
  show.subs = show.subs.filter(sub => sub.likelyness >= episodeThreshold)
  if (show.subs.length < 1) return null
  return show.subs.sort((resultA, resultB) => resultB.likelyness - resultA.likelyness)[0]
}

module.exports = findSubtitle
