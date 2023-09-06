import Express from 'express';
import cors from 'cors';
import salesRouter from './routers/salesRouter.js';

const app = Express();

// usar cors
app.use(cors());
app.use('/admin/sales', salesRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})