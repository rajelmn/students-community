import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: String,
    url: String,
    password: String,
    userName: String,
    message: String,
    date: String,
    id: String,
    image: String,
})


const channelSchema = mongoose.Schema({
    owner: String,
    date: Date,
    subject: String,
    id: String,
})

const channels = new mongoose.model('channels', channelSchema);
const messages = new mongoose.model('messages', userSchema);
const users = new mongoose.model('users', userSchema)
export { messages, users, channels }

