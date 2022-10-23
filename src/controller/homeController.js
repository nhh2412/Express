import multer from 'multer'
import connection from '../configs/connectDB'

const getHomePage = (req, res) => {
    connection.execute('SELECT * FROM `users`', function (err, results, fields) {
        return res.render('index.ejs', { dataUsers: results })
    })
}

const getUploadPage = (req, res) => {
    return res.render('upload.ejs')
}

const getDetailsPage = (req, res) => {
    const id = req.params.id
    connection.execute('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results, fields) {
        return res.render('details.ejs', { dataUser: results[0] })
    })
}

const getCreatePage = (req, res) => {
    return res.render('create.ejs')
}

const getUpdatePage = (req, res) => {
    const id = req.params.id
    connection.execute('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results, fields) {
        return res.render('update.ejs', { dataUser: results[0] })
    })
}

const createNewUser = (req, res) => {
    const { first_name, last_name, email, address } = req.body
    connection.execute(
        'insert into users(first_name,last_name,email,address) values (?,?,?,?) ',
        [first_name, last_name, email, address],
        function (err, results, fields) {
            return res.redirect('/')
        },
    )
}

const deleteUser = (req, res) => {
    connection.execute('delete from users where id = ?', [req.body.id], function (err, results, fields) {
        return res.redirect('/')
    })
}

const updateUser = (req, res) => {
    const { first_name, last_name, email, address, id } = req.body
    connection.execute(
        'update users set first_name = ?, last_name = ?, email = ?, address = ? where id = ?',
        [first_name, last_name, email, address, id],
        function (err, results, fields) {
            return res.redirect('/')
        },
    )
}

let handleUploadFile = async (req, res) => {
    if (req.fileValidationError) {
        return res.send(req.fileValidationError)
    } else if (!req.file) {
        return res.send('Please select an image to upload')
    }

    // Display uploaded image for user validation
    res.send(
        `You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`,
    )
    // });
}

let handleUploadMultipleFiles = async (req, res) => {
    if (req.fileValidationError) {
        return res.send(req.fileValidationError)
    } else if (!req.files) {
        return res.send('Please select an image to upload')
    }

    let result = 'You have uploaded these images: <hr />'
    const files = req.files
    let index, len

    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="/image/${files[index].filename}" width="300" style="margin-right: 20px;">`
    }
    result += '<hr/><a href="/upload">Upload more images</a>'
    res.send(result)
}

export default {
    getHomePage,
    getUploadPage,
    getDetailsPage,
    getCreatePage,
    getUpdatePage,
    createNewUser,
    deleteUser,
    updateUser,
    handleUploadMultipleFiles,
    handleUploadFile,
}
