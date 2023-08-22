const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/edTech')
const con = mongoose.connection
con.on('open', function () {
    console.log("connected ");
})
