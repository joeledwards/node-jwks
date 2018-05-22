module.exports = keyCache

const buzScheduler = require('@buzuli/scheduler')
const defaults = require('./defaults')

function keyCache (config = {}) {
  const {
    keyTtl = defaults.keyTtl
  } = config

  const scheduler = buzScheduler()
  const cache = {}

  function put (jwksUri, kid, key) {
    let uriEntry = cache[jwksUri]

    if (!uriEntry)
      uriEntry = cache[jwksUri] = {}

    const oldKeyEntry = uriEntry[kid]

    if (oldKeyEntry)
      oldKeyEntry.cancelExpire()

    const {cancel: cancelExpire} = scheduler.after(keyTtl, () => del(jwksUri, kid))

    const newKeyEntry = uriEntry[kid] = {
      key,
      cancelExpire
    }

    return newKeyEntry.key
  }

  function get (jwksUri, kid) {
    return cache[jwksUri] || {}[kid]
  }

  function has (jwksUri, kid) {
    return !!(cache[jwksUri] || {})[kid]
  }

  function del (jwksUri, kid) {
    let keyEntry = {}
    let uriEntry = cache[jwksUri]

    if (uriEntry) {
      keyEntry = uriEntry[kid]

      if (keyEntry) {
        delete uriEntry[kid]
      }

      if (Object.keys(uriEntry).length === 0) {
        delete cache[jwksUri]
      }
    }

    return keyEntry.key
  }

  return {
    put,
    has,
    get,
    del
  }
}
