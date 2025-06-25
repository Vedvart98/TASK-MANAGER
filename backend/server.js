const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./config/database');
const authRoutes = require('./routes/Auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Task Manager API is runnning' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

// 404 handler
app.use('/', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// app.get('/api/tasks',(req,res)=>{
//     res.json({
//         id:1,
//         title:'Sample'   
//     });
// });
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({ force: false });
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`server is listening on PORT http://localhost:${PORT}`);
        });

    } catch (error) {
        console.log('unable to start server: ', error);
        process.exit(1);
    }
};
startServer();