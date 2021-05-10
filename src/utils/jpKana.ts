/**
 * @returns boolean: true if `str` is empty string
 */
const isKana = (str: string): boolean => {
  return /^[\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F\s]*$/.test(str)
}

/**
 * @returns boolean: true if `str` is empty string
 */
const isHiragana = (str: string): boolean => {
  return /^[\u3040-\u309F\s]*$/.test(str)
}

/**
 * @returns boolean: true if `str` is empty string
 */
const isKatakana = (str: string): boolean => {
  return /^[\u30A0-\u30FF\uFF65-\uFF9F\s]*$/.test(str)
}

/**
 * @param  {string} str カタカナ
 * @returns string
 */
const katakanaToHiragana = (str: string): string => {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

/**
 * @param  {string} str ひらがな
 * @returns string
 */
const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, function (match) {
    const chr = match.charCodeAt(0) + 0x60
    return String.fromCharCode(chr)
  })
}

export {
  isKana,
  isHiragana,
  isKatakana,
  katakanaToHiragana,
  hiraganaToKatakana,
}
