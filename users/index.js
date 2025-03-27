const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true });


app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        });
        await user.save();
        res.send('User registered');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // Buscar por email en lugar de username
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' }); // Token con expiración
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

app.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user', details: err.message });
    }
});


   
app.listen(4001, () => console.log('User Service running on port 4001'));
