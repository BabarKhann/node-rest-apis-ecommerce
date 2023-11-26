import path from 'path';

import { Product } from '../models';

import multer from 'multer';
import CustomErrorHandler from '../services/CustomErrorHandler';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultiPartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single('image');

const productController = {
  async store(req, res, next) {
    handleMultiPartData(req, res, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      console.log(req.file);
      console.log(req);
      // const filePath = req.file.path

      return res.json({});
    });
  },
};

export default productController;
