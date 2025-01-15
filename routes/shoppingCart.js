
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

