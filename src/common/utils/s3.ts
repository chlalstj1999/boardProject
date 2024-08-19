import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../const/s3Client";
import { bucketName } from "../const/environment";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { BadRequestException } from "../exception/BadRequestException";

type FileNameCallback = (error: Error | null, filename: string) => void;

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp"];

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read",
    key: function (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) {
      if (!allowedExtensions.includes(path.extname(file.originalname))) {
        throw new BadRequestException("image 파일 확장자가 맞지 않음");
      }
      cb(null, `${uuidv4()}${Date.now().toString()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
