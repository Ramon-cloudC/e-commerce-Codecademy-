
const express = require('express');
const pool = require('../db');
const router = express.Router();

// get all orders 

router.get('/', async(req, res) => {

    try{
        const result = await pool.query('SELECT * FROM orders ORDER BY order_id');

        res.status(200).json({
            message: 'Successfully fetched all orders',
            data: result.rows,
        });

    } catch(err){
        res.status(400).json({
            message: 'Error getting orders',
            status: 'Failed',
        });
    }
});

// get orders by id
router.get('/:id', async(req, res) => {

    const { id } = req.params;

    try{
        const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [id]);

        if(result.rows.length === 0){
            return res.status(404).json({
                error: 'Order not found',
            })
        }

        res.status(200).json({
            message: 'Order successfully fetched',
            data: result.rows[0],
        });
    } catch(err){
        res.status(500).json({
            message: 'Internal server error',
            status: 'Failed',
        })
    }
});

// create order 

router.post('/', async(req, res) => {
    
    const {customer_id, order_date, status, total_amount, shipping_address, payment_status} = req.body;

    try{
        const result = await pool.query('INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [customer_id, order_date, status, total_amount, shipping_address, payment_status]
        );
        
        res.status(201).json({
            message: 'Order created',
            data: result.rows[0],
        });

    }catch(err){
        res.status(500).json({
            message: 'Error creatig order',
            status: 'Failed',
        })
    }
});

// update order by id


router.put('/:id', async(req, res) => {

    const { id } = req.params;
    const {order_date, status, total_amount, shipping_address, payment_status} = req.body;

    try{
        if(!order_date || !status || !total_amount || !shipping_address || !payment_status){
            return res.status(400).json({
                message: 'All fields are required',
                status: 'Failed',
            })
        }

        const result = await pool.query('UPDATE orders SET order_date = $1, status = $2, total_amount = $3, shipping_address = $4, payment_status = $5 WHERE order_id = $6',
            [order_date, status, total_amount, shipping_address, payment_status, id]    
        );
        
        if(result.rowCount === 0){
            return res.status(404).json({
                message: 'Order not found',
                status: 'Failed',
            })
        }
        

        res.status(200).json({
            message: 'Order updated successfully',
            data: result.rows[0],
        });
    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            status: 'Failed',
        });
    }

});

//delete order

router.delete('/:id', async (req, res) => {

    const { id } = req.params;
    
    try {
        
        const result = await pool.query('DELETE FROM orders WHERE order_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message:'Order not found',
                status: 'Failed',
            });
        }

        res.status(200).json({
            message: 'Order successfully deleted',
            status: 'Success'
        });

    } catch(err){
        res.status(500).json({
            message:'Error deleting order',
            status: 'Failed',
        });
    }
});
module.exports = router;