'use strict'

module.exports = function parsePackage(packageStr){
  var parsed = JSON.parse(packageStr)
  return parsed.epr
}
