const express = require("express");
const app = express();

const db = process.env.DB_URI || require('./config/keys_dev').mongoURI;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const path = require('path');

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
} else {
    app.get("/", (req, res) => res.send("Hello World!!"));
}

app.use(passport.initialize());
require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/tweets", tweets);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
