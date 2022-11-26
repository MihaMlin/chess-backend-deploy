import express from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';

const app = express(); //celotna aplikacija v app
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.get('/', (req, res) => res.send('Hello from homepage'));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));