const fs = require('fs');
const { S3 } = require('aws-sdk');

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadDoc = (
  name,
  file,
  type,
  // eslint-disable-next-line no-unused-vars
  cb: (error, data) => void
): void => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${process.env.AWS_BUCKET_ROOT_DIR}${name}`,
    Body: fs.readFileSync(file),
    ACL: 'public-read',
    ContentType: type,
  };

  s3.upload(params, function (error, data) {
    if (error) {
      console.log('S3 DOCUMENT COULD NOT BE UPLOADED', error);
    } else {
      console.log('S3 DOCUMENT UPLOADED SUCCESSFULLY', data);
    }
    cb(error, data);
  });
};

exports.uploadDocBase64 = (
  name,
  base64Data,
  contentType,
  // eslint-disable-next-line no-unused-vars
  cb: (error, data) => void
) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${process.env.AWS_BUCKET_ROOT_DIR}${name}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: contentType,
  };

  s3.upload(params, function (error, data) {
    if (error) {
      console.log('S3 DOCUMENT COULD NOT BE UPLOADED', error);
    } else {
      console.log('S3 DOCUMENT UPLOADED SUCCESSFULLY', data);
    }
    cb(error, data);
  });
};

exports.removeDoc = (
  key: string,
  // eslint-disable-next-line no-unused-vars
  cb: (err, data) => void
): void => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
  };

  s3.deleteObject(params, function (error, data) {
    if (error) {
      console.log('S3 DOCUMENT COULD NOT BE DELETED', error);
    } else {
      console.log('S3 DOCUMENT DELETED SUCCESSFULLY', data);
    }

    if (cb) {
      cb(error, data);
    }
  });
};
