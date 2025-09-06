const mongodb = require('mongoose');
require('dotenv').config();
const dburl = process.env.DATABASE_URL;
const dbConnect = () => {
    mongodb.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Database connected successfully");
    }).catch((error) => {
        console.log("Received an error while connecting to database");
        console.error(error);
        process.exit(1); // Exit the process with failure
    });
}
module.exports = dbConnect;