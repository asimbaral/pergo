const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: false}));

const database = require("./app/models");
database.mongoose
        .connect(database.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Successfully connected to Database!");
        }).catch(err => {
            console.log("Cannot connect to Database!", err);
            process.exit();
        });

require("./app/routes/post.routes")(app);

const multer = require("multer");

const upload = multer({

    dest: 'images',

    limits: {
        fileSize: 1000000,
    }

});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});