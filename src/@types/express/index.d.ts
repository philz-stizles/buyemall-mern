import { IUserDocument } from '@src/models/mongoose/user.model';

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
      file: any;
    }
  }
}
