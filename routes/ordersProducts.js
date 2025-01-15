
const express = require('express');
const pool = require('../db');
const router = express.Router();

// get all orderProducts

router.get('/', async(req, res) => {
    
    try{
        const result = await pool.query('SELECT * FROM order_products');

        res.status(200).json({
            message: 'Successfully fetched all order products',
            data: result.rows,
        });

    } catch(err){
        res.status(400).json({
            messgae: 'Error getting order products',
            status: 'Failed',
        });
    }
});

//get order products by id

router.get('/:id', async(req, res) => {

    const { id } = req.params;

    try{
        const result = await pool.query('SELECT * FROM order_products WHERE order_product_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message: 'Order producys not found',
                status: 'Failed'
            });
        }

        res.status(200).json({
            message: 'Successfully fetched the order products',
            status: 'Success',
        })

    } catch(err){
        res.status(404).json({
            message: 'Error getting the order products',
            status: 'Failed',
        });
    }
});

//create order products 

router.post('/', async(req, res) => {

    const {order_id, product_id, quantity} = req.body;

    try{
        const result = await pool.query('INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)', 
            [order_id, product_id, quantity]);

            res.status(201).json({
                message: 'Successfully created order products',
                data: result.rows[0],
            });

    } catch(err){
        res.status(500).json({
            message: 'Error creating order products',
            status: 'Failed',
        });
    }
});

// update order products

router.put('/:id', async(req, res) => {

    const { id } = req.params;
    const {order_id, product_id, quantity} = req.body;

    try{
        const result = await pool.query('UPDATE order_products SET order_id = $1, product_id = $2, quantity = $3 WHERE order_product_id = $4',
            [order_id, product_id, quantity, id]);

            if(result.rowCount === 0){
                return res.status(404).json({
                    message: 'Order products not found',
                    status: 'Failed',
                });
            }

    } catch(err){
        res.status(404).json({
            message: 'Order products not found',
            status: 'Failed',
        });
    }
});

// delete order products

router.delete('/:id', async(req, res) => {

    const { id } = req.params;

    try{
        const result = await pool.query('DELETE FROM order_products WHERE cart_id = $1', [id]);
        if(result.rowCount === 0){
            return res.status(404).json({
                error: 'Order products not found',
            });
        }

        res.status(200).json({
            message: 'Order products successfully deleted',
            data: result.rows,
        });
    } catch(err){
        res.status(500).json({
            messgae: 'Error deleting order products',
            status: 'Failed',
        });
    }
});



module.exports = router;

