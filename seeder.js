require("dotenv").config({ path: "./config/config.env" })

const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const Todo = require("./models/Todo")
const User = require("./models/User")




mongoose.connect(process.env.MONGO_URI);

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const todos = JSON.parse(fs.readFileSync(`${__dirname}/_data/todos.json`, 'utf-8'))

//Import Into DB
const importData = async () => {
    console.log("Importing Data ...".blue)
    try {
        await User.create(users)
        console.log("Users data have been imported".green)
        await Todo.create(todos)
        console.log("todos data have been imported".green)


        console.log("All Done".blue)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

//Delete  Data from DB
const deleteData = async () => {
    console.log("Destroying Data...".yellow)

    try {
        await User.deleteMany()
        console.log("Users data have been destroyed".red)
        await Todo.deleteMany()
        console.log("todos data have been destroyed".red)

        console.log("Done".blue)
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === "-i") {
    importData()
}

else if (process.argv[2] === "-d") {
    deleteData()
}

