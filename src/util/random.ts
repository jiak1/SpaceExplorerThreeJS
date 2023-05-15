const Chance = require("chance")

const chance = new Chance()

function getRandomInt(min, max) {
  return chance.integer({ min, max })
}

function getRandomFloat(min, max) {
  return chance.floating({ min, max })
}

export { getRandomFloat, getRandomInt, chance }
