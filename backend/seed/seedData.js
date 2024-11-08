const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const axios = require('axios');

const seedData = async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    
    const transactions = response.data.map(item => ({
        title: item.title,
        description: item.description,
        price: item.price,
        dateOfSale: new Date(item.dateOfSale),
        category: item.category,
    }));
    
    await Transaction.insertMany(transactions);
    console.log('Data seeded');
    mongoose.connection.close();
};

seedData();
