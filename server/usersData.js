import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    url: String,
    password: String,
    userName: String,
    message: String,
    date: String,
     id: String,
})

const messages = new mongoose.model('messages', userSchema);
const users = new mongoose.model('users', userSchema)
export { messages, users }

