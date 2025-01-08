
const express = require('express')
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the e-commerce app!');
});

app.listen(PORT, () => {
    console.log('Server listening to port ' + PORT);
});