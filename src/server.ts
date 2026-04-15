import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './modules/auth/routes';
import { authMiddleware } from './middleware/auth.middleware';
import cors from 'cors';
import testRoutes from './modules/test/routes';
import pdfRoutes from './modules/pdf/routes';
import userRoutes from './modules/user/routes';
// import zipRoutes from './modules/zip/routes'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.get('/', (req, res) => {
  res.send('Backend is running successfully');
});

app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/pdf', pdfRoutes);
app.use('/user', userRoutes);
// app.use('zip', zipRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});