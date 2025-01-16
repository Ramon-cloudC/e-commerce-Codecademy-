require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const pool = require('./db');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const shoppingCartRoutes = require('./routes/shoppingCart');
const orderProductsRoutes = require('./routes/ordersProducts');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');

const PORT = 3000;

//middleware
app.use(express.json()); //handle JSON data
app.use(express.urlencoded({
    extended: true,
}));

//handle the ejs file rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Welcome to the e-commerce app!');
});

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/shoppingCart', shoppingCartRoutes);
app.use('/ordersProducts', orderProductsRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);


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

