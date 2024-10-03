import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: String,
    url: String,
    password: String,
    userName: String,
    message: String,
    date: Date,
    answering: {
        isAnswering: Boolean,
        name: String,
        url: String,
        message: String,
        messageId: String,
      },
    id: String,
    isAdmin:Boolean,
    isEdit:Boolean,
    messageId: String,
    isLatex: Boolean,
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

