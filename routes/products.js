
const express = require('express');
const pool = require('../db');
const router = express.Router();

//get all products
router.get('/', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM products ORDER BY product_id');
        res.status(200).json({
            message: 'Successfully fetched all products',
            data: result.rows,
        });

    } catch(err){
        console.error('Error getting products:', err)
        res.status(500).send({
            message: 'Internal server error',
            status:'Failed',
        });
    }
 
});

//get products by id 
router.get('/:id', async(req, res) => {
    const { id } = req.params;

    try{
        const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);

        if(result.rows.length === 0){
            return res.status(404).json({
                message: 'Product not found',
                status: 'Failled',
            });
        }

        res.status(200).json({
            message: 'Product successfully fetched',
            data: result.rows[0],
        })

    } catch(err){
        console.error('Error getting the product:', err);
        res.status(404).json({
            message: 'Error getting product',
            status: 'Failed',
        });
    }
});

//create product 
router.post('/:id', async(req, res) => {
    
    const {name, price, description, stock_quantity, category_id} = req.body;

    try{
        const result = await pool.query('INSERT INTO products (name, price, description, stock_quantity, category_id) VALUES ($1, $2, $3, $4, $5)',
            [name, price, description, stock_quantity, category_id]);
        res.status(201).json({
            message:'Product successfully added in the db',
            data: result.rows,
        });

    } catch(err){
        console.error('Error creating product:', err);
        res.status(500).json({
            message: 'Error creating product',
            status: 'Failed',
        })
    }
});

///update product 
router.put('/', async(req, res) => {
    const { id } = req.params;
    const {name, price, description, stock_quantity, category_id} = req.body;
try{
    const result = await pool.query('UPDATE products SET name = $1, price = $2, description = $3, stock_quantity = $4, category_id = $5 WHERE product_id = $6 RETURNING *',
        [name, price, description, stock_quantity, category_id, id]);

        res.status(201).json({
            message: 'Product updated successfully',
            data: result.rows,
        })
} catch(err){
    console.error('Error updating products:', err);
    res.status(500).json({
        message: 'Internal server error',
        status: 'Failed',
    })
}
    
});

//delete product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const result = await pool.query('DELETE FROM products WHERE product_id = $1', [id]);

        if(result.rowCount === 0){
            return res.status(404).json({
                message:'Product not found',
                status: 'Failed',
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            status: 'Success'
        });

    } catch(err){
        console.error('Error deleting product:', err);
        res.status(500).json({
            message:'Error deleting product',
            status: 'Failed',
        });
    }
});

module.exports = router;