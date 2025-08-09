const AWS = require('aws-sdk');
const endpoint = process.env.S3_ENDPOINT || 'http://minio:9000';
const s3 = new AWS.S3({
  endpoint,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});
module.exports = {
  putObject: (params) => s3.putObject({ Bucket: process.env.S3_BUCKET || 'anime', ...params }).promise(),
  getSignedUrl: (operation, params) => s3.getSignedUrl(operation, { Bucket: process.env.S3_BUCKET || 'anime', ...params }),
};
