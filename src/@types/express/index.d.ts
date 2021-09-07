import { IUserDocument } from '@src/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
      file: any;
    }
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      __basedir: string;
    }
  }
}
