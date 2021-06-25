import mongoose, { Connection } from 'mongoose';

const mongooseConnect = (dbUri: string): void => {
  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection as Connection;

  db.once('open', async () => {
    console.log('Connected to database');
  });

  db.on('error', () => {
    console.log('Error connecting to database');
  });

  db.on('error', () => {
    console.log('Disconnected from database');
  });
};

export default mongooseConnect;
