/**
 * 半角・全角英数字及び半角記号を3文字でかな2文字分としてカウントする謎のやつ
 */
export const awesomeCharacterCount = (string: string): number => {
  const notSpecialCharactersPattern =
    /[^\u0021-\u007e\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]/g
  const specialCharacters = string.replace(notSpecialCharactersPattern, "")
  return string.length - specialCharacters.length / 3
}
