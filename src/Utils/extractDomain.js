export const extractDomain = url => {
  const regex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)/;
  const match = url?.match(regex);
  if (match && match.length > 1) {
    return match[1];
  }
  return url;
};
