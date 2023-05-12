const User = require("../models/User")
const ErrorResponse = require("../utils/ErrorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const { sendTokenResponse } = require("../utils/sendTokenResponse")
const colors = require("colors")

//@desc     Register User
//@route    POST /api/v1/auth/register
//@access   Public
const register = asyncHandler(async (req, res, next) => {
    const { name, password, email } = req.body
    const user = await User.create({ name, email, password, role })
    sendTokenResponse(user, 200, res)
    console.log("The User has been registred successfully".green)
})


//@desc     User Login
//@route    POST /api/v1/auth/register
//@access   Public
const login = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body

    if (!email || !password) return next(new ErrorResponse(400, "Please enter your email/password"))

    const user = await User.findOne({ email })

    if (!user) return next(new ErrorResponse(401, "Invalid email/password"))

    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) return next(new ErrorResponse(400, "Invalid email/password"))

    sendTokenResponse(user, 200, res)
    console.log("The User has been logged in successfully".green)
})

//@desc     Get Current Logged In User
//@route    GET /api/v1/auth/me
//@access   Private
const getCurrentLoggedInUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).send({ success: true, data: user })
    console.log("The Logged User has been fetched successfully".green)
})


//@desc     log user out/ clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
const logout = asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).send({ success: true })
    console.log("The User has been logout successfully".green)
})

module.exports = { register, login, getCurrentLoggedInUser, logout }
