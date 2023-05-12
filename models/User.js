const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add your email"],
        unique: [true, "This email is already registred"],
        validate: {
            validator: function (val) {
                return validator.isEmail(val)
            },
            message: "Please add a valid Email"
        }
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "The password should not be less than 6 characters"]
    }
}, {
    timestamps: true
})


//encrypt password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//authentication token generation
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Matching password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model("User", UserSchema)
