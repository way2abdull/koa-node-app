import { ENVIRONMENT } from "../constant/appConstants";
const AWS = require("aws-sdk");
import { createReadStream, unlink } from "fs";
var s3;

class AwsClass {
  constructor() {}

  async initializeAWS(): Promise<void> {
    if (
      process.env.ENV_NAME === ENVIRONMENT.PREPROD ||
      process.env.ENV_NAME === ENVIRONMENT.PRODUCTION
    ) {
      console.log("aws initialization started...........");
      AWS.config.update({
        region: process.env.AWS_REGION,
      });
      s3 = new AWS.S3();
    } else {
      console.log("AWS initialization started...........");
      AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });
      s3 = new AWS.S3();
    }
  }

  async getImg(key: string) {
    let param = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };
    return s3.getObject(param).promise();
  }

  async uploadImg(
    key: string,
    data: any,
    contentType: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let param = {
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Body: data,
          ACL: "public-read",
          ContentType: contentType,
        };
        const image = await s3.upload(param).promise();
        resolve(image.Location as string);
      } catch (error) {
        console.error("uploadImg : ", error);
        reject(error);
      }
    });
  }

  async getSignedUrl(key: string) {
    const getParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Expires: 604800,
    };
    return new Promise(function (resolve, reject) {
      s3.getSignedUrl("getObject", getParams, function (err: any, output: any) {
        if (err) resolve(err);
        else {
          resolve(output);
        }
      });
    });
  }

  async fetchObjectsInFolder(folderName: string) {
    try {
      // List objects from a specifiec folder
      const listParams = {
        Bucket: process.env.AWS_BUCKET,
        Prefix: folderName,
      };
      const listData = await s3.listObjectsV2(listParams).promise();

      listData.Contents.shift();

      const images = [];
      // Fetch each object in the folder
      await Promise.all(
        listData.Contents.map(async (object) => {
          images.push(`${process.env.AWS_URL}${object.Key}`);
        })
      );
      return images;
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async checkIfPathExists(path: string): Promise<boolean> {
    try {
      const listParams = {
        Bucket: process.env.AWS_BUCKET,
        Prefix: path,
        Delimiter: "/",
        MaxKeys: 1,
      };
      const listData = await s3.listObjectsV2(listParams).promise();
      return listData.Contents.length > 0 || listData.CommonPrefixes.length > 0;
    } catch (error) {
      console.error(`Error checking path existence: ${error.message}`);
      return false;
    }
  }

  async uploadFile(file: any): Promise<any> {
    try {
      let fileName = file.originalname;
      const localFilePath = file.path;
      let readStream = createReadStream(localFilePath);
      const params = {
        Key: `${process.env.AWS_FOLDER_PATH}${fileName}`,
        Body: readStream,
        Bucket: process.env.AWS_BUCKET,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: any, data: any) => {
          readStream.destroy();
          if (err) {
            console.error(`Error while readStream==>`, err);
            return reject(err); 
          }
            unlink(localFilePath, (err: any) => {
              if (err) {
                console.error(`file deletion failed!!`);
              }
            });
          return resolve(`${process.env.AWS_URL}${process.env.AWS_FOLDER_PATH}${fileName}`);
        });
      });
    } catch (error) {
      console.error(`we have an error while uploading doc to s3,${error}`);
    }
  }
}

export const S3upload = new AwsClass();
