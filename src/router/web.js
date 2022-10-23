import express from 'express'
import multer from 'multer'
import homeController from '../controller/homeController'
import path from 'path'
import appRoot from 'app-root-path'

let router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/public/image/')
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
})

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!'
        return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
}

let upload = multer({ storage: storage, fileFilter: imageFilter })

let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 3)

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/create', homeController.getCreatePage)
    router.get('/upload', homeController.getUploadPage)
    router.get('/details/user/:id', homeController.getDetailsPage)
    router.get('/update-user/user/:id', homeController.getUpdatePage)

    router.post('/create-new-user', homeController.createNewUser)
    router.post('/delete-user', homeController.deleteUser)
    router.post('/update-user', homeController.updateUser)

    router.get('/upload', homeController.getUploadPage)

    router.post('/upload-profile-pic', upload.single('profile_pic'), homeController.handleUploadFile)

    router.post(
        '/upload-multiple-images',
        (req, res, next) => {
            uploadMultipleFiles(req, res, (err) => {
                if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
                    // handle multer file limit error here
                    res.send('LIMIT_UNEXPECTED_FILE')
                } else if (err) {
                    res.send(err)
                } else {
                    // make sure to call next() if all was well
                    next()
                }
            })
        },
        homeController.handleUploadMultipleFiles,
    )

    return app.use('/', router)
}

export default initWebRoute
