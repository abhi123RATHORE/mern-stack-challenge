import React, { useEffect, useState } from 'react';
import { getStatistics } from '../api';

const Statistics = ({ month }) => {
    const [stats, setStats] = useState({ totalAmount: 0, totalSold: 0, totalNotSold: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await getStatistics(month);
            setStats(response.data);
        };
        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Sale Amount: {stats.totalAmount}</p>
            <p>Total Sold Items: {stats.totalSold}</p>
            <p>Total Not Sold Items: {stats.totalNotSold}</p>
        </div>
    );
};

export default Statistics;
