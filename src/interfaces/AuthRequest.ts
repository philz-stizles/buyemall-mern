import { Request } from 'express';
import { UserDocument } from '@src/models/userModel';

export interface IAuthRequest extends Request {
  user: UserDocument;
}
