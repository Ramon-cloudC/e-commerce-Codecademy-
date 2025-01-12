require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');

const PORT = 3000;

//middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the e-commerce app!');
});

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.error('Error connecting to the db', err.stack);
    } else {
        console.log('Connected to the db successfully!');
    };
});

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

