"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./modules/auth/routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const cors_1 = __importDefault(require("cors"));
const routes_2 = __importDefault(require("./modules/test/routes"));
const routes_3 = __importDefault(require("./modules/pdf/routes"));
const routes_4 = __importDefault(require("./modules/user/routes"));
// import zipRoutes from './modules/zip/routes'
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.connectDB)();
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });
app.get('/', (req, res) => {
    res.send('Backend is running successfully');
});
app.use('/auth', routes_1.default);
app.use('/test', routes_2.default);
app.use('/pdf', routes_3.default);
app.use('/user', routes_4.default);
// app.use('zip', zipRoutes);
app.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    res.json({ message: 'You are authorized' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
