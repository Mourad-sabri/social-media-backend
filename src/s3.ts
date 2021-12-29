import * as AWS from "aws-sdk";

export const client = new AWS.S3({
  accessKeyId: "A2BR8X2U4PNVD1TEG1FU",
  secretAccessKey: "QggTRcz3qFCniZVHQEwkIbl9aEiwLmIxPHhHqn6m",
  endpoint: "casatalk.us-southeast-1.linodeobjects.com",
  sslEnabled: true,
  signatureVersion: "v4",
  s3DisableBodySigning: true,
  s3ForcePathStyle: true,
  signatureCache: false,
  params: {
    Headers: {
      Authorization: "Bearer a3a2d643b70fb14f4f3768d464d1b715c5718247b5970f6dd42949724642ce84",
    },
  },
});
