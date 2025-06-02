import express from 'express';
import axios from 'axios';
import fs from 'fs';
import cron from 'node-cron';
import basicAuth from 'express-basic-auth';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['IDOSELL_DOMAIN', 'IDOSELL_API_KEY'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(` Ustaw zmienna środowiskowa ${envVar} ponieważ nie jest ustawiona w pliku .env`);
        process.exit(1);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

const IDOSELL_DOMAIN = process.env.IDOSELL_DOMAIN;
const IDOSELL_API_BASE = `https://${IDOSELL_DOMAIN}/api/admin/v5`;
const API_KEY = process.env.IDOSELL_API_KEY;

app.use(express.json());
app.use(express.static('public'));

app.use('/api', basicAuth({
    users: { [process.env.BASIC_AUTH_USERNAME || 'admin']: process.env.BASIC_AUTH_PASSWORD || 'password123' },
    challenge: true
}));

function transformOrderData(ordersResponse) {
    const transformedOrders = [];
    
    const ordersArray = ordersResponse?.Results || ordersResponse?.data || [];
    
    if (Array.isArray(ordersArray)) {
        ordersArray.forEach(order => {
            let orderWorth = 0;
            if (order.orderDetails?.payments?.orderCurrency) {
                const currency = order.orderDetails.payments.orderCurrency;
                orderWorth = parseFloat(currency.orderProductsCost || 0) + 
                           parseFloat(currency.orderDeliveryCost || 0) + 
                           parseFloat(currency.orderPayformCost || 0) + 
                           parseFloat(currency.orderInsuranceCost || 0);
            }
            
            const transformedOrder = {
                orderID: order.orderId || order.orderSerialNumber,
                products: [],
                orderWorth: orderWorth
            };
            
            if (order.orderDetails?.productsResults && Array.isArray(order.orderDetails.productsResults)) {
                order.orderDetails.productsResults.forEach(product => {
                    transformedOrder.products.push({
                        productID: product.productId,
                        quantity: parseInt(product.productQuantity || 0)
                    });
                });
            }
            
            transformedOrders.push(transformedOrder);
        });
    }
    
    return transformedOrders;
}

async function fetchOrdersFromIdosell() {
    try {
        const daysBack = parseInt(process.env.DAYS_BACK) || 30;
        const limit = process.env.ORDERS_LIMIT || '100';
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - daysBack);
        const dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
        
        const params = new URLSearchParams({
            'created_from': dateFrom,
            'limit': limit
        });
        
        console.log(`Pobieranie zamówień z parametrami: ${params.toString()}`);
        
        const response = await axios.get(`${IDOSELL_API_BASE}/orders/orders?${params.toString()}`, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Pobrano zamówienia:', response.data);
        
        const transformedData = transformOrderData(response.data);
        
        fs.writeFileSync('./orders_raw.json', JSON.stringify(response.data, null, 2));
        
        fs.writeFileSync('./orders_data.json', JSON.stringify(transformedData, null, 2));
        
        return transformedData;
    } catch (error) {
        console.error('Błąd pobierania zamówień:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
        console.error('URL:', error.config?.url);
        console.error('Message:', error.message);
        throw error;
    }
}

function filterOrdersByWorth(orders, minWorth, maxWorth) {
    return orders.filter(order => {
        const worth = order.orderWorth;
        const min = minWorth ? parseFloat(minWorth) : 0;
        const max = maxWorth ? parseFloat(maxWorth) : Infinity;
        return worth >= min && worth <= max;
    });
}

function convertToCSV(orders) {
    if (!orders || orders.length === 0) {
        return 'orderID,productID,quantity,orderWorth\n';
    }
    
    let csv = 'orderID,productID,quantity,orderWorth\n';
    
    orders.forEach(order => {
        if (order.products && order.products.length > 0) {
            order.products.forEach(product => {
                csv += `${order.orderID},${product.productID},${product.quantity},${order.orderWorth}\n`;
            });
        } else {
            csv += `${order.orderID},,0,${order.orderWorth}\n`;
        }
    });
    
    return csv;
}

app.get('/api/orders', async (req, res) => {
    try {
        const { minWorth, maxWorth } = req.query;
        
        let orders;
        try {
            const data = fs.readFileSync('./orders_data.json', 'utf8');
            orders = JSON.parse(data);
        } catch (fileError) {
            orders = await fetchOrdersFromIdosell();
        }
        
        if (minWorth || maxWorth) {
            orders = filterOrdersByWorth(orders, minWorth, maxWorth);
        }
        
        res.json({
            success: true,
            count: orders.length,
            filters: { minWorth, maxWorth },
            data: orders
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd pobierania zamówień', 
            details: error.message 
        });
    }
});

app.get('/api/orders/csv', async (req, res) => {
    try {
        const { minWorth, maxWorth } = req.query;
        
        let orders;
        try {
            const data = fs.readFileSync('./orders_data.json', 'utf8');
            orders = JSON.parse(data);
        } catch (fileError) {
            orders = await fetchOrdersFromIdosell();
        }
        
        if (minWorth || maxWorth) {
            orders = filterOrdersByWorth(orders, minWorth, maxWorth);
        }
        
        const csv = convertToCSV(orders);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd generowania CSV', 
            details: error.message 
        });
    }
});

app.get('/api/orders/raw', (req, res) => {
    try {
        const data = fs.readFileSync('./orders_raw.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd odczytu surowych danych', 
            details: error.message 
        });
    }
});

app.get('/api/orders/:orderID', async (req, res) => {
    try {
        const { orderID } = req.params;
        
        let orders;
        try {
            const data = fs.readFileSync('./orders_data.json', 'utf8');
            orders = JSON.parse(data);
        } catch (fileError) {
            orders = await fetchOrdersFromIdosell();
        }
        
        const order = orders.find(o => o.orderID.toString() === orderID.toString());
        
        if (!order) {
            return res.status(404).json({
                error: 'Zamówienie nie zostało znalezione',
                orderID: orderID
            });
        }
        
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd pobierania zamówienia', 
            details: error.message 
        });
    }
});

app.post('/api/orders/refresh', async (req, res) => {
    try {
        const orders = await fetchOrdersFromIdosell();
        res.json({
            success: true,
            message: 'Dane zostały odświeżone',
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd odświeżania danych', 
            details: error.message 
        });
    }
});

app.get('/api/status', (req, res) => {
    try {
        let ordersCount = 0;
        let lastUpdate = null;
        
        try {
            const data = fs.readFileSync('./orders_data.json', 'utf8');
            const orders = JSON.parse(data);
            ordersCount = orders.length;
            
            const stats = fs.statSync('./orders_data.json');
            lastUpdate = stats.mtime;
        } catch (fileError) {
            console.error('Blad fileError:');
        }
        
        res.json({
            success: true,
            status: 'running',
            ordersCount,
            lastUpdate,
            apiEndpoints: {
                orders_json: '/api/orders',
                orders_csv: '/api/orders/csv',
                specific_order: '/api/orders/:orderID',
                refresh: '/api/orders/refresh (POST)',
                raw_data: '/api/orders/raw'
            },
            queryParameters: {
                minWorth: 'Minimalna wartość zamówienia',
                maxWorth: 'Maksymalna wartość zamówienia'
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Błąd sprawdzania statusu', 
            details: error.message 
        });
    }
});

cron.schedule(process.env.CRON_SCHEDULE || '0 6 * * *', async () => {
    console.log('Codzienne automatyczne pobieranie zamówień...');
    try {
        const orders = await fetchOrdersFromIdosell();
        console.log(`Zamówienia zaktualizowane: ${orders.length} zamówień`);
    } catch (error) {
        console.error('Błąd automatycznego pobierania:', error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
    console.log(`Dostępne endpointy:`);
    console.log(`- GET  /api/orders - wszystkie zamówienia (JSON)`);
    console.log(`- GET  /api/orders/csv - wszystkie zamówienia (CSV)`);
    console.log(`- GET  /api/orders/:id - konkretne zamówienie`);
    console.log(`- POST /api/orders/refresh - ręczne odświeżenie`);
    console.log(`- GET  /api/status - status aplikacji`);    console.log(`\nParametry filtrowania: ?minWorth=100&maxWorth=500`);
    console.log(`Basic Auth: ${process.env.BASIC_AUTH_USERNAME || 'admin'} / ${process.env.BASIC_AUTH_PASSWORD || 'password123'}`);
    
    fetchOrdersFromIdosell()
        .then((orders) => console.log(`Inicjalne pobieranie zakończone: ${orders.length} zamówień`))
        .catch(err => console.error('Błąd inicjalnego pobierania:', err.message));
});