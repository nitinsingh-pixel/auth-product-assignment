import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("Users", userSchema);
export default userModel;