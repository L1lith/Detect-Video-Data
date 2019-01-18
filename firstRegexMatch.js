function firstRegexMatch(string, ...regexs) {
  if (regexs.length < 1) throw new Error("Must supply at least 1 regular expression")
  let output = null
  for (let i = 0; i < regexs.length && output === null; i++) {
    output = (string.match(regexs[i]) || [])[0] || null
  }
  return output
}

module.exports = firstRegexMatch
