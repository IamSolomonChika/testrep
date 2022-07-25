//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const mSchema = mongoose.Schema;


const app = express();



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/usersDB');

const userSchema = new mSchema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRETKEY, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});



app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    console.log(req.body.username)

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});











app.listen(port, () => {
    console.log('Server Has Started Successfully.');
});