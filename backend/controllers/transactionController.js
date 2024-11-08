const Transaction = require('../models/Transaction');
const axios = require('axios');

// Initialize database with seed data
exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data.map(item => ({
            title: item.title,
            description: item.description,
            price: item.price,
            dateOfSale: new Date(item.dateOfSale),
            category: item.category,
        }));
        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List transactions with search and pagination
exports.listTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1, 2020")).getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const query = {
        dateOfSale: { $gte: startDate, $lte: endDate },
        ...(search && { $or: [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] }),
    };

    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
    
    const total = await Transaction.countDocuments(query);
    
    res.status(200).json({ transactions, total });
};

// Statistics API
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1, 2020")).getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSold: { $sum: 1 } } }
    ]);
    
    const notSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, price: 0 });
    
    res.status(200).json({
        totalAmount: totalSales[0]?.totalAmount || 0,
        totalSold: totalSales[0]?.totalSold || 0,
        totalNotSold: notSoldItems,
    });
};

// Bar chart data
exports.getBarChartData = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1, 2020")).getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const priceRanges = [
        { $match: { price: { $gte: 0, $lt: 100 }, dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '0-100', count: { $sum: 1 } } },
        { $match: { price: { $gte: 100, $lt: 200 } } },
        { $group: { _id: '101-200', count: { $sum: 1 } } },
        // Add more ranges...
    ];
    
    const results = await Transaction.aggregate(priceRanges);
    res.status(200).json(results);
};

// Pie chart data
exports.getPieChartData = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1, 2020")).getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json(categories);
};

// Combined API
exports.getCombinedData = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1, 2020")).getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSold: { $sum: 1 } } }
    ]);
    
    const notSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, price: 0 });
    
    res.status(200).json({
        transactions,
        totalAmount: totalSales[0]?.totalAmount || 0,
        totalSold: totalSales[0]?.totalSold || 0,
        totalNotSold: notSoldItems,
    });
};
