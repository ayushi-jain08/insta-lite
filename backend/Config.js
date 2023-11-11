const mongoose = require('mongoose')

const ConnectDb = async() => {
    try {
        await mongoose.connect(process.env.CONNECTION)
        console.log("connected")
    } catch (error) {
        console.log("Not Connected")
    }
}

module.exports = ConnectDb;

