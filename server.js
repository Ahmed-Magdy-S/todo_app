const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan")
const cookieParser = require('cookie-parser');
const colors = require("colors")
const errorHandler = require("./middlewares/error")
const connectDB = require("./config/db")
const app = express()

//load env variables
dotenv.config({ path: "./config/config.env" })

//load routes
const todosRoutes = require("./routes/todos")
const usersRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")

//cookie parser middleware
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

//body parser middleware
app.use(express.json())


//mount routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", usersRoutes)
app.use("/api/v1/todos", todosRoutes)

//error handler middleware
app.use(errorHandler)


const PORT = process.env.PORT || 5000
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta.bold)
    })
}).catch((e) => {
    console.log("The server cannot be run due to some problem at a connection to db".bgRed.white.bold,e);
})
