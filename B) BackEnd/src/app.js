const express = require('express');
const cors = require("cors");
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'..', '..', 'A) FrontEnd', 'Markup(HTML)'));

app.use(express.static(path.join(__dirname,'..','..','A) FrontEnd')));

app.get('/', (req, res) => {
  res.render('home');
});
app.use('/', require('./routes'));

module.exports = app;