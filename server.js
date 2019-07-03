const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan());

const apps = require('./store');

app.get('/apps', (req, res) => {
    const { sort, genre } = req.query;
    if (!genre) {
        res.status(400).send('Please specify a genre')
    };
    if (genre) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre)) {
            res.status(400).send('Genre must be action, puzzle, strategy, casual, arcade, or card')
        }
        let results = apps.filter(app => app.Genres.toLowerCase().includes(genre.toLowerCase()));
        console.log(results)
        if (sort) {
            console.log('sort included')
            if (!['rating', 'app'].includes(sort)) {
                res.status(400).send('Please sort by rating or app')
            }
            if (sort.toLowerCase() === 'app') {
                results.sort((a, b) => {
                    return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0;
                });
            } else if (sort.toLowerCase() === 'rating') {
                results.sort((a, b) => {
                    return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
                });
            }

        };
        res.send(results);
    }
});

app.listen(8000, () => {
    console.log('Server started on port 8000')
});