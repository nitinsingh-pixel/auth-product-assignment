import multer, { memoryStorage } from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/image\/(jpeg|png|webp|gif)/.test(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Only image files are allowed"))
        }
    }
})

export default upload;