import { config } from "dotenv"
import pkg from "pg"
const { Client } = pkg

config()

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt( process.env.DATABASE_PORT ),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

client.connect((err) => {
    if (err) {
        console.log('Error connecting to database: ' + err.message);
    } else {
        console.log('Connected to database: ' + process.env.DATABASE_NAME);
    }
})

const query = (sql, callback) => {
    client.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        callback( result.rows );
    })
    client.end;
}

export default query;