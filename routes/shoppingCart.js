
const express = require('express');
const pool = require('../db');
const router = express.Router();

// get shopping carts

router.get('/', async(req, res) => {

    try{
        const result = await pool.query('SELECT * FROM shopping_cart');

        res.status(200).json({
            message: 'Successfully fetched all shopping carts',
            data: result.rows,
        });
    }catch(err){
        res.status(400).json({
            message: 'Error getting shopping carts',
            status: 'Failed',
        });
    }
});

//get shopping cart by id

router.get('/:id', async(req, res) => {

    const { id } = req.params;

    
    try{
        const result = await pool.query('SELECT * FROM shopping_cart WHERE cart_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message: 'Cart not found',
                status: 'Failed',
            })
        }
        res.status(200).json({
            message: 'Successfully fetched the shopping cart',
            data: result.rows[0],
        });
    }catch(err){
        res.status(404).json({
            message: 'Error getting the shopping cart',
            status: 'Failed',
        });
    }
});

//create cart 

router.post('/', async(req, res) => {
    
    const { customer_id, created_at, updated_at } = req.body;
    
    if(!customer_id || !created_at){
        return res.status(500).json({
            message: 'Credentials are required',    
        });
    }

    try{
        const result = await pool.query('INSERT INTO shopping_cart (customer_id, created_at, updated_at) VALUES ($1, $2, $3)',
            [customer_id, created_at, updated_at]
        );
        res.status(201).json({
            message: 'Cart successfully created',
            data: result.rows[0],
        })
        
    } catch(err){   
        res.status(500).json({
            message: 'Internal server error',
            status: 'Failed'
        });
    }
});

// checkout route from cart 

router.post('/:id/checkout', async(req, res) => {
    const { id } = req.params;
    const { payment_method, shipping_address } = req.body; //in this case the req.body will be given by the form, with the user input during the checkout process 

    if(!payment_method || !shipping_address){
        return res.status(400).json({
            messgae: 'All fields are required',
            status: 'Failed',
        })
    }
    try{

        //validate cart 

        const cartResult = await pool.query('SELECT * FROM shopping_cart WHERE customer_id = $1', [id]);

        if(cartResult.rowCount === 0){
            return res.status(404).json({
                message: 'Cart not found',
                status: 'Failed',
            })
        }

        //validate items cart 
        
        const cartItemsResult = await pool.query('SELECT * FROM order_products WHERE customer_id = $1', [id]);

        if(!cartItemsResult){
            return res.status(404).json({
                message: 'Cart is empty',
                status: 'Failed'
            });
        }

        //save the result of order products
        const cartItems = cartItemsResult.rows;

        //Calculate total amount by fetching prices for each product

        let totalAmount = 0;

        for (const item of cartItems) {
            const productResult = await pool.query(
                'SELECT price FROM products WHERE product_id = $1',
                [item.product_id]
            );

            if (productResult.rowCount === 0) {
                return res.status(404).json({
                    message: `Product with ID ${item.product_id} not found.`,
                    status: 'Failed',
                });
            }

            const productPrice = productResult.rows[0].price;
            totalAmount += productPrice * item.quantity;
        }
        
        //validate payment

        const paymentStatus = 'Success'; //in this project we assume that the payment is always set to 'Success' 

        if(paymentStatus !== 'Success'){
            return res.status(500).json({
                message: 'Payment failed',
                status: 'Failed',
            });
        }
        //Create the order
        const orderResult = await pool.query(
            `INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address, payment_status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                id,
                new Date(),
                'Processing',
                totalAmount,
                shipping_address,
                'Paid',
            ]
        );

        const order = orderResult.rows[0];

        // 5. Link cart items to the order
        for (const item of cartItems) {
            await pool.query(
                `INSERT INTO order_products (order_id, product_id, quantity)
                 VALUES ($1, $2, $3)`,
                [order.order_id, item.product_id, item.quantity]
            );
        }

        // 6. Clear the cart
        await pool.query('DELETE FROM order_products WHERE customer_id = $1', [id]);
        await pool.query('DELETE FROM shopping_cart WHERE customer_id = $1', [id]);

        // Respond with the created order
        res.status(200).json({
            message: 'Checkout successful.',
            data: {
                order,
                cartItems,
            },
        });

    } catch(err){
        res.status(400).json({
            message: 'Cart not found', 
            status: err,
        });
    }
})
// update cart 

router.put('/:id', async(req, res) => {

    const { id } = req.params;
    const { customer_id, created_at, updated_at } = req.body;

    try{
        const result = await pool.query('UPDATE shopping_cart SET customer_id = $1, created_at = $2, updated_at = $3 WHERE cart_id = $4', 
            [customer_id, created_at, updated_at, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Cart not found' 
                });
            }
            res.status(200).json({
                message: 'Cart updated successfully',
                data: result.rows[0],
            });
    } catch(err){
        res.status(500).json({
            message: 'Error updating cart',
            status: 'Failed',
        });
    }
});

//deelte cart

router.delete('/:id', async (req, res) => {

    const { id } = req.params;

    try {
        
        const result = await pool.query('DELETE FROM shopping_cart WHERE cart_id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Cart not found' 
            });
        }
        res.status(200).json({ 
            message: 'Cart deleted successfully',
            status: 'Success', 
        });
    } catch (err) {
        res.status(500).json({
             message: 'Error deleting cart',
             status: 'Failed' 
            });
    }
});



module.exports = router;

