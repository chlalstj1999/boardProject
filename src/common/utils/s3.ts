import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../const/s3Client";
import { bucketName } from "../const/environment";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

type FileNameCallback = (error: Error | null, filename: string) => void;
// multer는 Node.js에서 form-data를 저장하기 위한 모듈이며 s3는 아마존에서 서비스하는 클라우드 저장소
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) {
      cb(null, `${uuidv4()}${Date.now().toString()}_${file.originalname}`);
    },
  }),
  fileFilter(req, file, callback) {
    const type = file.mimetype.split("/")[1];

    if (type !== "jpg" && type !== "png" && type !== "jpeg") {
      callback(null, false);
    }
  },
  limits: { fileSize: 30 * 1024 },
});
