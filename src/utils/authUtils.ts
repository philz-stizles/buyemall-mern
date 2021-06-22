// import { promisify } from 'util';
import jwt, { Secret } from 'jsonwebtoken';
import { UserDocument } from '@src/models/userModel';
// import { IJWTokenPayload } from '@src/interfaces/JsonWebToken';

export const generateToken = (user: UserDocument): string =>
  jwt.sign(
    { id: user._id },
    process.env.JWT_AUTH_SECRET as Secret, // The secret should atleast 32 characters long
    { expiresIn: process.env.JWT_AUTH_EXPIRES_IN }
  );

export const verifyToken = async (token: string): Promise<any> => {
  // eslint-disable-next-line no-return-await
  // await promisify(jwt.verify)(token, process.env.JWT_AUTH_SECRET);
  return jwt.verify(token, `${process.env.JWT_AUTH_SECRET}`, function (err, decoded) {
    return err || decoded;
  });
};
