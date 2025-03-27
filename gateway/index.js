const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();

app.use('/users', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }));
app.use('/products', createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:4003', changeOrigin: true }));

app.listen(4000, () => console.log('API Gateway running on port 4000'));
