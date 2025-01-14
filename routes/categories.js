
const express = require('express');
const router = express.Router();
const pool = require('../db');

// get all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.status(200).json({
            message:'Successfully fetched all categories',
            data: result.rows,
        });
    } catch (err) {
        console.error('Error getting categories:', err);
        res.status(500).json({
             message: 'Internal server error' ,
             status: 'Failed',
            });
    }
});

// get a category by ID
router.get('/:id', async (req, res) => {

    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Category not found', 
            });
        }
        res.status(200).json({
                message: 'category successfully fetched',
                data:result.rows[0],
            });
    } catch (err) {
        res.status(500).json({ 
            error: err.message, 
        });
    }
});

// Add a new category
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json({
            message: 'Successfully created a category',
            data: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({
             message: 'Error creating category',
             status: 'Failed'
             });
    }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1, description = $2 WHERE category_id = $3 RETURNING *',
            [name, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Category not found' 
            });
        }
        res.json({
            message: 'Successfully updated category',
            data: result.rows[0],
        });
    } catch (err) {
        res.status(400).json({ 
            error: err.message 
        });
    }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Category not found' 
            });
        }
        res.status(200).json({ 
            message: 'Category deleted successfully',
            status: 'Success', 
        });
    } catch (err) {
        res.status(500).json({
             message: 'Error deleting category',
             status: 'Failed' 
            });
    }
});

module.exports = router;
