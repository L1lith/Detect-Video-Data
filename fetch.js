const cloudscraper = require('cloudscraper')

function fetch(...args) {
  return new Promise((resolve, reject)=>{
    cloudscraper.get(...args, (err, response) => {
      if (err) return reject(err)
      resolve(response)
    })
  })
}

module.exports = fetch
