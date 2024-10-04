import express from 'express';
import {createServer} from 'node:http';
import { Socket } from 'socket.io-client';
import 'dotenv/config';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';
import path from 'node:path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { messages, users, channels} from './usersData.js';
import multer from 'multer';
import { isAuthenticated } from './isAuthenticated.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const upload = multer({ dest:"uploads/" })
const PORT = 3000;

const server = createServer(app);

const io = new Server(server , {
    cors: {
        origin: '*'
    }, 
    connectionStateRecovery: {}
})

cloudinary.config({
    cloud_name: "dwa2csohq",
    api_key: "665725662135347",
   api_secret:"Y2Dk2D6ExFwjQjLNlo9i6DLbq_0"
});

io.on('connection', (socket) =>{
    

    socket.on('join', async (id) => {
        try {
            socket.join(id);
            // console.log(id);
            const genrealChannels = 'math' || 'physics' || 'science' || 'discussion';
            const channelId = await channels.find({id}).exec();
            console.log('channelId', channelId)
            // checking if the joined id is in the db or not
            if (channelId.length === 0 && !['math', 'physics', 'science', 'discussion'].includes(id)) {
                console.log('la condition is met')
                io.to(id).emit('error');
            }

        } catch(err) {
            console.log(err)
        }

    })

    socket.on('delete', async (msg, id) => {
        console.log('delete');
        console.log(msg)
        io.to(id).emit('delete', msg);
        await messages.findOneAndDelete(msg[0])
    })
    socket.on('message', (msg,  id) => {
        console.log('emitting messasge')
        io.to(id).emit('chat', msg)
    })


    socket.on('edit', async (newMsg, oldMessageId, id) => {
        console.log('edited with the new msg', newMsg)
        io.to(id).emit('edit', newMsg, oldMessageId)
        await messages.findOneAndUpdate({messageId:oldMessageId}, {message:newMsg, isEdit:false})
    })

    socket.on('change', (name, id) => {
        console.log(name + 'is typing')
        io.to(id).emit('change', name)
    })

    socket.on('channels', async (channelDetail, id) => {
        const channel =  await new channels(channelDetail);
        await channel.save();
        console.log('emitting channels');
        io.emit('channels', channelDetail)
    })

    socket.on('answer', (messageId, id) => {
        
    })
 
    socket.on('disconnect', () => {
        // console.log('user disconnected')
    })
} )
mongoose.connect(process.env.DB_URL)
.then(() => console.log('database connected'))
.catch(err => console.log('failed to connect', err));

app.use(session({
    secret: 'dang',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // httpOnly: true,
        sameSite: 'strict',
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        }),
        // maxAge: 1000 * 60 * 30
    }
}))
app.use(cookieParser())
app.use(cors());
// app.use(isAuthenticated);
app.use(express.json());


app.post('/register', upload.single('file'), async (req, res) => {
   
    try{
            const {name,password, userName} = JSON.parse(req.body.user);
            const check = await users.findOne({userName}).exec();
            if(check) {
                console.log(check);
                console.log('user already exist')
               return res.status(403).json({errorMessage: 'user already exist'});
            }
            const result = await cloudinary.uploader.upload(req.file.path);
            const image = result.secure_url || result.url;
            // console.log(image)
            const user = new users({
                name,
                password,
                userName,
                url: image
            })
            await user.save();
            req.session.name = user.name;
            req.session.userName = user.userName;
            req.session.url = user.url;
            req.session.isLoggedIn = true;
            res.status(200).json({message: 'logged succesfully'})
            // console.log(user)
        }catch (err) {
            console.log(err);
        }
        
    })

    
    app.post('/storemessage', isAuthenticated,upload.single('file'),async (req, res) => {
        try {
    
            const body = JSON.parse(req.body.user);
            console.log(body, 'body')
            let imageUrl;
            if(req.file) {
                const image = await cloudinary.uploader.upload(req.file?.path);
                 imageUrl = image?.secure_url
            }
            const user = new messages(
                 {
                     name: body.name,
                     message: body.message,
                     url: body.url,
                     date: body.date,
                     id: body.id,
                     userName: body.userName,
                     answering: {
                        isAnswering: body.answering.isAnswering,
                        name: body.answering.name,
                        url: body.answering.url,
                        message: body.answering.message,
                        messageId: body.answering.messageId
                     },
                     isLatex:body.isLatex,
                     messageId: body.messageId,
                     image: imageUrl
                 }
             )
             await user.save();
             console.log(user, 'this is the goddamn user');
             if(!imageUrl) {
                return res.status(401).json({message: "no image is sent"})
             }
             res.status(200).json(imageUrl)
        }catch(err) {
            console.log('oops');
            console.log(err)
        }
    })

    app.get('/userData', (req, res) => {
        try {  
            res.status(200).json({
                name: req.session.name,
                url: req.session.url,
                userName: req.session.userName,
            })
        } catch(err) {
            console.log('couldnt get user data: ', err)
        }
    })
    
    app.post('/getdata',isAuthenticated,async (req, res) => {
    try{
        const data = await messages.find({ id: req.body.id}).exec();
        res.status(200).json(data)
    }
    catch(err) {
        console.log('hmmm something went wrong with sending the data', err);
        res.status(403).json({message: 'failed to get the channel data'})
    }
})

app.get('/getChannels',isAuthenticated, async (req, res) => {
    try {
        const allChannels = await channels.find().exec();
        res.send(allChannels)     

    } catch(err) {
        console.log(err)
    }
})

app.use('/images', express.static('images'))
app.use(express.static('dist'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'))
})

server.listen(3000, () => {
    console.log('app running on ' + PORT)
})
