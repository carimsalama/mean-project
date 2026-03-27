const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const connectDB = require('./config/dbConnection');
const corsMiddleware = require('./middleware/cors.middleware')



app.use(corsMiddleware);
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/product', require('./routes/products.route'));
app.use('/api/address', require('./routes/address.route'));
app.use('/api/category', require('./routes/categories.route'));
app.use('/api/subcategory', require('./routes/subCategories.route'));
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/orders', require('./routes/order.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/testimonial', require('./routes/testimonial.route'));
app.use('/api/faqs', require('./routes/faq.route'));
app.use('/api/contacts', require('./routes/contact.route'));







const init = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`connected to server with Port ${PORT}`);
    });

};

init();


