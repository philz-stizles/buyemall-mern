import { ObjectId } from 'mongodb';

export interface MutationResponse {
  code: string;
  success: boolean;
  message: string;
}

interface IUserToken {
  token: string;
}

export interface IUserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  passwordChangedAt?: Date;
  passwordResetExpiresIn?: number;
  passwordResetToken: string | undefined;
  role: string;
  // eslint-disable-next-line no-unused-vars
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  // eslint-disable-next-line no-unused-vars
  isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean;
  isActive: boolean;
  tokens: IUserToken[];
}
