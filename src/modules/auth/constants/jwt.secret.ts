export const jwtConfig = {
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
};
