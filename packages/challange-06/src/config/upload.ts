import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
      const hash = crypto.randomBytes(10).toString('HEX');

      const fileName = `${hash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
