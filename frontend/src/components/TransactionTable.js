import React, { useEffect, useState } from 'react';
import { listTransactions, getStatistics } from '../api';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [month, setMonth] = useState('March');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, [month, search, page]);

    const fetchTransactions = async () => {
        const response = await listTransactions(month, search, page);
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    return (
        <div>
            <h2>Transactions Table</h2>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input type="text" placeholder="Search" value={search} onChange={handleSearch} />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                <button onClick={() => setPage((prev) => (prev * 10 < total ? prev + 1 : prev))}>Next</button>
            </div>
        </div>
    );
};

export default TransactionTable;
