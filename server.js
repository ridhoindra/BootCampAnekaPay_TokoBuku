const express = require('express')
const app = express()
require ('./models/koneksi')
const bodyParser = require("body-parser");
var session = require('express-session')
const bukuRoute = require('./controllers/routerbuku');
const userRoute = require('./controllers/routeruser');
const auth = require('./utils/basicAuth')

app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'secrett',
    resave: true,
    saveUninitialized: true
}));

app.use('/admin',auth.is_admin, bukuRoute);
app.use('/', userRoute);

app.listen(process.env.PORT || 3000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});