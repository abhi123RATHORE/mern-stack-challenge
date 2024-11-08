import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getBarChartData } from '../api';

const BarChartComponent = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const response = await getBarChartData(month);
            setData(response.data);
        };
        fetchBarChartData();
    }, [month]);

    return (
        <div>
            <h2>Bar Chart</h2>
            <BarChart width={600} height={300} data={data}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default BarChartComponent;
