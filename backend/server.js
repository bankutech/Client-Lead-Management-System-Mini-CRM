const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
require('dotenv').config();
require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/', (req, res) => {
    res.send('Mini CRM API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
