import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Report = () => {
    const [reportData, setReportData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 0 for total orders, 1 for total earnings

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found, please log in');
                    return;
                }
                const response = await fetch('http://localhost:8001/reports/monthly-orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                setReportData(data);
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchReportData();
    }, []);

    // Prepare data for charts
    const totalOrdersData = reportData.map(item => ({
        month: item.month,
        total_orders: item.total_orders
    }));

    const totalEarningsData = reportData.map(item => ({
        month: item.month,
        total_earnings: item.total_earnings
    }));

    const isTotalOrders = currentPage === 0;

    // Navigation handlers
    const handleNext = () => {
        setCurrentPage(1);
    };

    const handlePrevious = () => {
        setCurrentPage(0);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            paddingTop: 3,
            ml: {xs: '1%', sm: '10%', md: '15%', lg: '20%'},
            mr: {xs: '0%', sm: '3%', md: '5%', lg: '7%'},
            mb: {xs: 1, sm: 2, md: 3, lg: 4},
        }}>
            <ResponsiveContainer width="90%" height={400}>
                <LineChart data={isTotalOrders ? totalOrdersData : totalEarningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {isTotalOrders ? (
                        <Line type="monotone" dataKey="total_orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                    ) : (
                        <Line type="monotone" dataKey="total_earnings" stroke="#82ca9d" />
                    )}
                </LineChart>
            </ResponsiveContainer>
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', marginRight:4 }}>
                {currentPage > 0 && (
                    <Button 
                        variant="outlined" 
                        onClick={handlePrevious}
                        sx={{ bgcolor: '#FF8C00', color: 'white', textTransform: 'none' }}
                        >
                        Previous
                    </Button>
                )}
                <Box sx={{ marginLeft: 'auto' }}>
                    {currentPage < 1 && (
                        <Button 
                            variant="outlined" 
                            onClick={handleNext} 
                            sx={{ bgcolor: '#FF8C00', color: 'white', textTransform: 'none' }}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};