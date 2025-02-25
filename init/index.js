const mongoose = require("mongoose");
const initData = require("./data.js");
//const path = require("path");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
console.log("Connected to DB");
})
.catch((err) => {
console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_URL);
}

//new frunction
const initDB = async () => {
    await Listing.deleteMany({}); //ye phele k sara data db se delete krega phele
    initData.data = initData.data.map((obj) => ({...obj, owner: "6777d2412921af30ab8b1d2d"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
};

initDB(); //then calling