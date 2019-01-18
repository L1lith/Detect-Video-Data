const mkdirp = require('mkdirp')

function mkdirpAsync(folder) {
  return new Promise((resolve, reject) => {
    mkdirp(folder, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = mkdirpAsync
