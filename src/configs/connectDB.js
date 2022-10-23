// get the client
import { createConnection } from 'mysql2'

// create the connection to database
const connection = createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nodejsbasic',
})

export default connection
