import connection from '../configs/connectDB'

const getAllUsers = (req, res) => {
    connection.execute('SELECT * FROM `users`', function (err, results, fields) {
        return res.status(200).json({
            message: 'get list users done!',
            data: results,
        })
    })
}

const createNewUser = (req, res) => {
    const { first_name, last_name, email, address } = req.body
    if (!first_name || !last_name || !email || !address)
        return res.status(200).json({
            message: 'create new user missing!',
        })
    connection.execute(
        'insert into users(first_name,last_name,email,address) values (?,?,?,?) ',
        [first_name, last_name, email, address],
        function (err, results, fields) {
            return res.status(200).json({
                message: 'create new user done! ',
            })
        },
    )
}

const deleteUser = (req, res) => {
    if (!req.params.id)
        return res.status(200).json({
            message: 'delete user missing!',
        })
    connection.execute('delete from users where id = ?', [req.params.id], function (err, results, fields) {
        return res.status(200).json({
            message: 'delete user done!',
        })
    })
}

const updateUser = (req, res) => {
    const { first_name, last_name, email, address, id } = req.body
    if (!first_name || !last_name || !email || !address || !id)
        return res.status(200).json({
            message: 'update user missing!',
        })
    connection.execute(
        'update users set first_name = ?, last_name = ?, email = ?, address = ? where id = ?',
        [first_name, last_name, email, address, id],
        function (err, results, fields) {
            return res.status(200).json({
                message: 'update user done!',
            })
        },
    )
}

export default {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
}
