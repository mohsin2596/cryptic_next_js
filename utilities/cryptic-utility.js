export function obfuscateText(text) {
    return text.split('').map(char => '&#' + char.charCodeAt(0) + ';').join('');
  }
  
export function deobfuscateText(obfuscatedText) {
  if (typeof window === 'undefined') {
    return '';
  }
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = obfuscatedText;
  return tempDiv.textContent || tempDiv.innerText || '';
}
  