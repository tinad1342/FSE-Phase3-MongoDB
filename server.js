const express = require('express');
const fs = require('fs');
const port = 4000;

var app = express();

app.use(express.static('public'));             // URL '/' (root) maps to 'public' directory
app.use('/static', express.static('public'));  // URL '/static' also maps to 'public' directory


app.listen(port);
