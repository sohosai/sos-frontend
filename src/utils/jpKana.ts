/**
 * @returns boolean: true if `str` is empty string
 */
const isKana = (str: string): boolean => {
  return /^([ぁ-ゔ]|[ァ-ヴ])*$/.test(str)
}

/**
 * @returns boolean: true if `str` is empty string
 */
const isHiragana = (str: string): boolean => {
  return /^[ぁ-ゔ]*$/.test(str)
}

/**
 * @returns boolean: true if `str` is empty string
 */
const isKatakana = (str: string): boolean => {
  return /^[ァ-ヴ]*$/.test(str)
}

/**
 * @param  {string} str カタカナ [ァ-ヴ]
 * @returns string
 */
const katakanaToHiragana = (str: string): string => {
  return str.replace(/[\u30a1-\u30f4]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

/**
 * @param  {string} str ひらがな [ぁ-ゔ]
 * @returns string
 */
const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3094]/g, function (match) {
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
