import mysql from 'mysql';

const params = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
};

const Connect = async (): Promise<mysql.Connection> =>
  new Promise<mysql.Connection>((resolve, reject) => {
    const connection = mysql.createConnection(params);

    connection.connect(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve(connection);
    });
  });

const Query = async (connection: mysql.Connection, query: string): Promise<unknown> =>
  new Promise((resolve, reject) => {
    connection.query(query, connection, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });

export { Connect, Query };
