import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getPieChartData } from '../api';

const PieChartComponent = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            const response = await getPieChartData(month);
            setData(response.data);
        };
        fetchPieChartData();
    }, [month]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <h2>Pie Chart</h2>
            <PieChart width={400} height={400}>
                <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default PieChartComponent;
