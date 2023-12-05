const express = require('express');
const app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"zubair@mysqlroot1",
    database:"jokes_api"
});

con.connect(err => {
    if(err) throw err;
    console.log("Connected to database");
});

app.post("/joke", (req, res) => {
   let sql = `SELECT * FROM jokes ORDER BY id`;
   con.query(sql, (err, result) => {
       if(err) throw err;
       let randomJoke = result[Math.floor(Math.random()*result.length)];
       return res.send(randomJoke);
   });
});

app.post('/find-joke/token/:token', (req, res) => {
    let token = req.params.token;
    let sql = `SELECT * FROM jokes WHERE token = ?`;
    con.query(sql, token, (err, result) => {
        if(err) throw err;
        return res.send(result);
    });
});

app.post('/find-joke/id/:id', (req, res) => {
    let id = req.params.id;
    id = parseInt(id);
    let sql = `SELECT * FROM jokes WHERE id = ?`;
    con.query(sql, id, (err, result) => {
        if(err) throw err;
        return res.send(result);
    });
});

app.post('/add-joke/:joke', (req, res) => {
    let joke = req.params.joke;
    let token = Math.floor(Math.random()*9999999);
    let sql = `INSERT INTO jokes(joke, token) VALUES(?, ?)`;
    let new_joke = [joke, token];
    con.query(sql, new_joke, (err) => {
        if(err) throw err;
        return res.json({
            name:'success',
            message:'Added new joke successfully'
        });
    });
});

app.listen(80);