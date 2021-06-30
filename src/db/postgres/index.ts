/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT ? +(process.env.PG_PORT as string) : 5432,
});

export default {
  query: (
    text: string,
    params: any,
    callback: (err: Error, result: QueryResult<any>) => void
  ): void => {
    return pool.query(text, params, callback);
  },
};
