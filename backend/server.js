import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import clc from "cli-color";
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import authRouter from './routes/adminAuth.js'
import passport from 'passport';
import requestModel from './models/requestModel.js';
import adminRouter from './routes/adminRoutes.js';
import './passport-setup.js';
import isAdmin from './middleware/isAdmin.js';


// Colors to highlight
let info = clc.blue;
let highlight = clc.yellowBright.bgWhiteBright.bold.underline;

// App Config
const app = express()
const port = 4000

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(
    (req, res, next) => {
        let message = info(req?.method, " request to route");
        let route = highlight(req?.path);
        console.log(message, route, '');

        const origin = req?.headers?.origin;
        let cookieInfo = {
            maxAge: 1000 * 60 * 60 * 24,
        }

        if (process.env.PRODUCTION_ENV === 'true') {
            // set response headers for Cross Domain Requests
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            // set sameSite to none for cross domain requests
            cookieInfo.sameSite = 'none';
            cookieInfo.secure = true;
        }

        return session({
            name: 'Forever-Admin-Panel',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                autoRemove: 'native',
                collectionName: 'sessions',
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
            },
        })(req, res, next);
    })

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/auth', authRouter);
app.use('/admin', isAdmin, adminRouter);

app.post('/request', async (req, res) => {
    try {
        let { email } = req.body;
        await connectDB();
        let requests = await requestModel.findOne({
            email, status: 'pending',
        })
        if(requests){
            return res.status(400).send({message: 'Request Already Exists \n Wait until Admin Approves'});
        }
        await requestModel.create({
            email,
        })
        return res.status(200).send({message: 'Request has been sent to Admin!\n'});
    } catch (error) {
        console.log("error while adding New User Request", error);
        return res.status(500).send(error.message);
    }
})

// Connect to MongoDB and then start the server
const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();
        app.listen(port, () => {
            console.log(`✅ Server listening at port ${port}\n URL: http://localhost:${port}`);
        });
    } catch (err) {
        console.error('⛔ Failed to start the server:', err);
    }
};
startServer();