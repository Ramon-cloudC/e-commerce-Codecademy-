
const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');


// get the registration user form
router.get('/', (req, res) => {
    res.render('registerForm', {title: 'User Registration'});
});

// send the user details with post req

router.post('/', async(req, res) => {
    const {first_name, last_name, email, address, phone_number, password } = req.body;

    if(!first_name || !last_name || !email || !address || !phone_number || !password){
        res.status(400).json({
            message: 'All fields are required',
            status: 'Failed',
        })
    }
    
        try{
            //If the email is found, inform the user that the email is already registered
            const checkEmail = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
            if(checkEmail.rows.length > 0){
                return res.status(400).json({
                    message: 'Email already in use',
                    status: 'Failed',
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await pool.query('INSERT INTO customers (first_name, last_name, email, address, phone_number, password) VALUES ($1, $2, $3,$4, $5, $6)',
                [first_name, last_name, email, address, phone_number, hashedPassword]
            );
                console.log('Insert result:', result.rows[0]);
                
                res.redirect('/login');
                // res.status(201)
                // .json({
                //     message: 'Customer/user registered successfully',
                //     data: result.rows[0],
                // });

        } catch(err){
            res.status(500).json({
                message: 'Internal server error',
                status: 'Failed'
            });
        }
});

module.exports = router;