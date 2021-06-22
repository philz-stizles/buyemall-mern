import { UserDocument } from '@src/models/userModel';

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
      file: any;
    }
  }
}
