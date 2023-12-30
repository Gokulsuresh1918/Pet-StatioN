const multer = require('multer');
const path = require('path');


// Multer for products images upload
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({  
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'../public/MulterUploads/') ); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename for each uploaded image
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPG and PNG images are allowed.'), false);
  }
};

// Setting up middleware for multer
const upload = multer({ storage, fileFilter });
 module.exports={upload}
