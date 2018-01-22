const express = require('express');
const app = express();
const path = require('path');//our passport auth module
const router = require('./router/router');//loading router from routes folder
const port = 3000;
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');// we are going to use handlebars as view engine
const setupAuth = require('./services/auth')
// require('./services/passport')//since it's not returning anything there is nothing to assign to passport config - therefore we load it just like a piece of code 
require('dotenv').config();//dotenv package would allow us to use credentials from .env package

// middleware(automatically used for every request that comes into our application)
app.use(express.static(__dirname + '/public')); //dirname here refers to root folder where app lives
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);//must tell to node to use router(we are loading on top) instead of app for routing
setupAuth(app);
app.use(router);//must tell to node to use router(we are loading on top) instead of app for routing
// let's setup the view engine and directory for templates
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handleBars({defaultLayout: 'main', extname: 'hbs', layoutsDir: __dirname + '/views/layouts'}));

app.listen(port, (error)=>{
    (!error) ? console.log('listening on port ', port) : console.log('something  went wrong')
})

