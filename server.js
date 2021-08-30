//DEPENDENCIES
const express = require('express');
const fs = require('fs');
const path = require('path');
//NMP package to create unique id
const uniqid = require('uniqid');

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to serve static assets directly
app.use(express.static('public'));

//Array to save notes
var noteArr = [];

//ROUTES

//API Routes

//GET Route
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        };
    });
});

//POST Route
app.post('/api/notes', (req, res) => {
    req.body.id = uniqid();
    noteArr.push(req.body);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(noteArr), (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send(noteArr);
        };
    });
});

//DELETE ROUTE
app.delete('api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), (err, data) => {
        if (err) {
            console.log(err)
        } else {
            noteArr = JSON.parse(data);
            noteArr = noteArr.filter((note) => {
                return note.id != req.params.id
            });
            fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(noteArr), (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send(noteArr);
                };
            });
        };
    });
});

//HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));;
});

//LISTENER -- starts server
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
})