import Express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import salesRouter from './routers/salesRouter.js';
config();

const app = Express();

// usar cors
app.use(cors());
app.use('/api/admin/sales', salesRouter)

app.get('/', (req, res) => {
    res.send('Hi, World!');
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})