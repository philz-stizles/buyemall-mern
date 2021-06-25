import { Request } from 'express';
import { UserDocument } from '@src/models/user.model';

export interface IMulterAuthRequest extends Request {
  file: any;
  user: UserDocument;
}
