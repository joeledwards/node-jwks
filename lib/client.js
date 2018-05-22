module.exports = client

const axios = require('axios')
const keyCache = require('./key-cache')

function client (config = {}) {
  const {

  } = config

  const cache = keyCache()

  function getKey ({jwksUri, kid}) {
    if (cache.has(jwksUri, kid)) {
      return Promise.resolve(cache.get(jwksUri, kid))
    } else {
      return axios.get(jwksUri).then(({status, data}) => {
        // TODO:
        // 1. convert all keys
        // 2. cache all keys
        // 3. supply key if present; reject if absent
      })
    }
  }

  return {
    getKey
  }
}
