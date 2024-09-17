import express from 'express';
import {createServer} from 'node:http';
import { Socket } from 'socket.io-client';
import 'dotenv/config';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';
import path from 'node:path';
import { messages, users, channels} from './usersData.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const upload = multer({ dest:"./" })
const PORT = 3000;

const server = createServer(app);

const io = new Server(server , {
    cors: {
        origin: '*'
    }, 
    // connectionStateRecovery: {}
})

cloudinary.config({
    cloud_name: "dwa2csohq",
    api_key: "665725662135347",
   api_secret:"Y2Dk2D6ExFwjQjLNlo9i6DLbq_0"
});

io.on('connection', (socket) =>{

    socket.on('join', (id) => {
        socket.join(id)
    })
    socket.on('message', (msg,  id) => {
        console.log('emitting messasge')
        io.to(id).emit('chat', msg)
    })

    socket.on('channels', async (channelDetail, id) => {
        const channel =  await new channels(channelDetail);
        await channel.save();
        console.log('emitting channels');
        io.emit('channels', channelDetail)
    })
 
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
} )
mongoose.connect(process.env.DB_URL)
.then(() => console.log('database connected'))
.catch(err => console.log('failed to connect', err));

app.use(cors())
app.use(express.json());

app.post('/storemessage', async (req, res) => {
    try {
        console.log('storing data with  id:' + req.body. id)
        const user = new messages(
             {
                 name: req.body.name,
                 message: req.body.message,
                 url: req.body.url,
                 date: req.body.date,
                  id: req.body. id
             }
         )
         await user.save();
         res.send(user);
    }catch(err) {
        console.log('oops');
        console.log(err)
    }
})

app.post('/storeuser', upload.single('file'), async (req, res, next) => {
   
        try{
            const {name,password, userName} = JSON.parse(req.body.user);
            const check = await users.findOne({userName}).exec();
            if(check) {
                res.json(403).send({errorMessage: 'user already exist'});
                console.log(check);
                console.log('user already exist')
                return
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
            res.send(user);
            // console.log(user)
      }catch (err) {
        console.log(err);
      }

})

app.post('/getdata', async (req, res) => {
    try{
        const data = await messages.find({ id: req.body. id}).exec();
        res.status(200).json(data)
    }
    catch(err) {
        console.log('hmmm something went wrong with sending the data', err);
        res.status(403).json({message: 'failed to get the channel data'})
    }
})

app.get('/getChannels', async (req, res) => {
    try {
        const allChannels = await channels.find().exec();
        console.log(channels)
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
