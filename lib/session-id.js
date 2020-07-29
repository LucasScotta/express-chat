const buildRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min
const buildRandomChar = (min, max) => String.fromCharCode(buildRandom(min, max))

const buildRandomNumber = () => buildRandomChar(0x30, 0x39)
const buildRandomLower = () => buildRandomChar(0x61, 0x7A)
const buildRandomUpper = () => buildRandomChar(0x41, 0x59)

const buildRandomLetter = () => {
  const r = Math.random()
  if (r < 0.3) return buildRandomNumber()
  if (r < 0.6) return buildRandomUpper()
  else return buildRandomLower()
}

module.exports = (length) => {

  const buffer = []
  while (buffer.length < length) {
    buffer.push(buildRandomLetter())
  }
  return buffer.join('')
}