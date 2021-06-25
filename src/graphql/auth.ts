import { NextFunction, Request, Response } from 'express';

const graphqlAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next();
};

export default graphqlAuthenticate;
