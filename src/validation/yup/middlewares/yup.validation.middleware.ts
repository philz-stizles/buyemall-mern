import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import logger from '@src/loggers/logger';

const validationRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (e) {
      logger.error('YUP VALIDATION MIDDLEWARE', e.message, e);
      return res.status(400).send(e.errors);
    }
  };

export default validationRequest;
