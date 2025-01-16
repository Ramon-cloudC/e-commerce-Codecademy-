
const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');



//get the login form
router.get('/', (req, res) => {
    res.render('loginForm', {title: 'User Login'});
});

//login with credentials
router.post('/', async(req, res) => {

    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: 'All fields are required',
            status: 'Failed',
        });
    }

    try{
        const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);

        if(result.rows.length === 0){
           return res.status(400).json({
                message: 'Invalid email or password',
                status: 'Failed'
            });
        }

        const user = result.rows[0];
        console.log(result.rows);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        res.render('welcome', {firstName: user.first_name});


    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            status: 'Failed',
        });
    }
});

module.exports = router;