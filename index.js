require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const orderController = require('./controller/Order');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', orderController);

app.listen('3000', () => {
    console.log("server ok");
});