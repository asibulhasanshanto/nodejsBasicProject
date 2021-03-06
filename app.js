const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');

const app = express();

// Body parser, reading data from body into req.body
app.use(bodyParser.json());

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//routers
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log("start\n");
    // const message = "{\"body\":\"body is required\",\"title\":\"title is required\"}";
    // console.log(JSON.parse(message));
    // console.log("end\n");
    next();
});

//ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);


app.use(globalErrorHandler);

module.exports = app;

