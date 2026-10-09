import multer from 'multer';
import path from 'path';

// Memory storage keeps uploaded files in RAM buffer (req.file.buffer),
// completely preventing executable files on disk and orphan temp files.
const storage = multer.memoryStorage();

// File filter checking both extension and mime type strictly
const fileFilter = (req, file, cb) => {
  const allowedExt = /\.pdf$/i;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExt.test(ext);
  const isValidMime =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/acrobat' ||
    file.mimetype === 'applications/vnd.pdf';

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }

  const error = new Error('Invalid file type. Only PDF documents (.pdf) are allowed.');
  error.code = 'INVALID_FILE_TYPE';
  return cb(error, false);
};

// 5 MB limit strictly enforced
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter,
});

/**
 * Single file upload middleware with robust status 400 error handling
 */
export const handlePdfUpload = (req, res, next) => {
  const singleUpload = upload.single('file');

  singleUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds the 5 MB limit. Please upload a smaller PDF file.',
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      }

      if (err.code === 'INVALID_FILE_TYPE' || err.message) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Only PDF documents are allowed.',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Error processing uploaded file.',
      });
    }

    next();
  });
};

/**
 * Optional single file upload middleware
 */
export const handleOptionalPdfUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return handlePdfUpload(req, res, next);
  }
  return next();
};

export default handlePdfUpload;
