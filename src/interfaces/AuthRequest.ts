import { Request } from 'express';
import { UserDocument } from '@src/models/user.model';

export interface IAuthRequest extends Request {
  user: UserDocument;
}
