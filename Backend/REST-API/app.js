


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');


const app = express();
db();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use(express.static('storage'));

app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`API_REST corriendo en el puerto:  ${port}`);
});






