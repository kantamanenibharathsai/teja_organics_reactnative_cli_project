const salt = 'salt-string';

export const encryption = (text: string) => {
  const textToChars = (text: string) =>
    text.split('').map(c => c.charCodeAt(0));
  const byteHex = (n: string) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

export const decryption = (encoded: string) => {
  const textToChars = (text: string) =>
    text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = (code: any) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    ?.map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
};
