
const express = require('express');
const pool = require('../db');
const router = express.Router();

// get all the customers
router.get('/', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM customers ORDER BY customer_id;');
        res.status(200).json({
            status: 'Success',
            data: result.rows,
        });
        console.log(result.rows);
        
    } catch (err){
        res.status(500).send({
            message: 'Internal server error',
            status: 'Failed',
        });
        console.error(err);
    };
    
});

//get customer by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try{
        const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);

        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'Customer not found',
                status: 'Failed',
            });
        }
        
        console.log(result.rowCount);
    
        res.status(200).json({
            message:'Customer successfully fetched',
            data: result.rows[0],
        })
    } catch(err){
        console.error('Error fetching customer', err);
        res.status(404).json({
            message:'Error fetching customer',
            status: 'Failed',
        });
    }
});

//create customer
router.post('/:id', async (req, res) => {

    const {first_name, last_name, email, address, phone_number} = req.body;
    
    //validate the input
    if(!first_name || !last_name || !email || !address || !phone_number){
        return res.status(400).json({
            message:'All fields are required',
            status:'Not successful',
        })
    }
   
    try {
        const customer = await pool.query('INSERT INTO customers (first_name, last_name, email, address, phone_number) VALUES ($1, $2, $3,$4, $5) RETURNING *', 
            [first_name, last_name, email, address, phone_number]);
        res.status(201).json({
            status: 'Successfully added customers',
            data: customer.rows,
        });
        console.log(customer);
    } catch (err){
        res.status(500).send({
            status: 'Not successful',
            message: 'Couldn\'t add cutomer, try again.',
        });
        console.error('Error whilst creating customer:', err)
    };
});

//update customer
router.put('/:id', async (req, res) => {
    
    const { id } = req.params;
    const {first_name, last_name, email, address, phone_number} = req.body;
    
    try {

        const result = await pool.query('UPDATE customers SET first_name = $1, last_name = $2, email = $3, address = $4, phone_number = $5 WHERE customer_id = $6 RETURNING *',
            [first_name, last_name, email, address, phone_number, id]
        );

        console.log(result);

        res.status(201).json({
            status: 'Success',
            data: result.rows,
        });
    } catch (err){
        res.status(500).json({
            message: 'Couldn\'t update the table',
            status: 'Error',
        });
        console.error({
            message: 'Error updating customer:', err
        });
    }
});

//delete customer
router.delete('/:id', async (req, res) => {

    const { id } = req.params;
    
    try {
        
        const result = await pool.query('DELETE FROM customers WHERE customer_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message:'Customer not found',
                status: 'Failed',
            });
        }

        res.status(200).json({
            message: 'Customer successfully deleted',
            status: 'Success'
        });

    } catch(err){
        console.error('Error deleting customer:', err);
        res.status(500).json({
            message:'Error deleting customer',
            status: 'Failed',
        });
    }
});

module.exports = router;