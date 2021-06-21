const TOKEN_TYPE_SUFFIX = '00000000000000000000000000000000';

export const getTokenType = (tokenId: string): string => {
  return "0x" + tokenId.slice(2, 34) + TOKEN_TYPE_SUFFIX;
}

