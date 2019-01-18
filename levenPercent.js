const leven = require('leven')

function levenPercent(stringA, stringB) {
  if (typeof stringA != 'string') throw new Error("Input 1 is not a string")
    if (typeof stringB != 'string') throw new Error("Input 2 is not a string")
  return 1 - (leven(stringA, stringB) / Math.max(stringA.length, stringB.length))
}

module.exports = levenPercent
