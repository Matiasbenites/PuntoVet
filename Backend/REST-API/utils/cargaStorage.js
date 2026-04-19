


const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const patch = `${__dirname}/../storage`;
        cb(null, patch);
    },
    filename: (req, file, cb) => {
        console.log('File de la iamgen: ', file);
        const ext = file.originalname.split('.').pop();
        const filename = `file-${Date.now()}.${ext}`;
        cb(null, filename);
    }
})

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;