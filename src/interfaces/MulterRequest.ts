import { Request } from 'express';
import { UserDocument } from '@src/models/userModel';

export interface IMulterAuthRequest extends Request {
  file: any;
  user: UserDocument;
}
