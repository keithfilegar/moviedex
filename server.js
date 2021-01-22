require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./moviedex.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    console.log(`api token is ${apiToken}`);
    console.log(`auth token is ${authToken}`)


    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }

    next();
})

function handleGetMovie(req, res) {
    let response = MOVIEDEX;

    if(req.query.genre) {
        response = response.filter(movie => 
            movie.genre.includes(req.query.genre))
    }

    res.json(response)
}

app.get('/movie', handleGetMovie);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})