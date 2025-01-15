
const express = require('express');
const pool = require('../db');
const router = express.Router();

//get payments

router.get('/', async(req, res) => {
    
    try{
        const result = await pool.query('SELECT * FROM payments');

        res.status(200).json({
            message: 'Successfully fetched all payments',
            data: result.rows,
        });

    } catch(err){
        res.status(404).json({
            message: 'Payments not found',
            status: 'Failed',
        });
    }
});

//get payment by id
router.get('/:id', async(req, res) => {
    
    const { id } = req.params;

    try{
        const result = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [id]);

        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'Payment details not found',
                status: 'Failed',
            })
        }

        res.status(200).json({
            message: 'Successfully fetched the details of payment_id: ' + id,
            data: result.rows,
        });

    } catch(err){
        res.status(404).json({
            message: 'Payments not found',
            status: 'Failed',
        });
    }
});

//create payment

router.post('/', async(req, res) => {

    const {order_id, payment_method, payment_date, amount, status} = req.body;

    try{
        const result = await pool.query('INSERT INTO payments (order_id, payment_method, payment_date, amount, status) VALUES ($1, $2, $3, $4, $5)', 
            [order_id, payment_method, payment_date, amount, status]
        );
    
        res.status(201).json({
            message: 'Successfully created payment details',
            data: result.rows[0],
        });
    }catch(err){
        res.status(500).json({
            message: 'Error creating payment details',
            status: 'Failed',
        });
    }
  
});

//update payment

router.put('/:id', async(req, res) => {

    const { id } = req.params;
    const {order_id, payment_method, payment_date, amount, status} = req.body;

    try{
        const result = await pool.query('UPDATE payments SET order_id = $1, payment_method = $2, payment_date = $3, amount = $4, status = $5 WHERE payment_id = $6', 
            [order_id, payment_method, payment_date, amount, status, id])

            console.log(result.rows);

            res.status(200).json({
                message: 'Payment details successfully updated',
                data: result.rows[0],
            });

    } catch(err){
        res.status(500).json({
            message: 'Internal server error',
            status: 'Failed',
        });
    }
    
});

//delete payment

router.delete('/:id', async(req, res) => {

    const { id } = req.params;

    try{
        const result = await pool.query('DELETE FROM payments WHERE payment_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message: 'Payment details not found',
                status: 'Failed'
            })
        }
        res.status(200).json({
            message: 'Payment details successfully deleted',
            status: 'Success',
        });

    }catch(err){
        res.status(404).json({
            message: 'Error deleting payment details',
            status: 'Failed',
        });
    }
});







module.exports = router;