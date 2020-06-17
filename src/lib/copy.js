function copyToClipboard(text) {
  if (!navigator.clipboard) {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const result = document.execCommand('copy');
        if (result) resolve();
        reject();
      } catch (err) {
        reject();
      }
      document.body.removeChild(textArea);
    });
  }

  return navigator.clipboard.writeText(text);
}

export default copyToClipboard;
