const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// use this when connected to Heroku
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// otherwise use this
// delete before upload to GitHub
//const dbURL = '';

// attempt connection to MongoDB
mongoose.connect(dbURL, (err) => {
    if(err) {
        console.log('Could not connect to database');
        throw err;
    }
});

const router = require('./router.js');

// setting up express
const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

// attempt to start page
app.listen(port, (err) => {
    if(err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});