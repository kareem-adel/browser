export function validateAndAppendHttps(url) {
  const regex = /^(?!(?:\w+:)?\/\/)/;
  if (regex.test(url)) {
    return `https://${url}`;
  }
  return url;
}
