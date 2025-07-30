export const isJWTIssuedBeforePasswordChanged = (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
): boolean =>
  new Date(passwordChangedTimestamp).getTime() / 1000 > jwtIssuedTimestamp;
