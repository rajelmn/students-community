import { io } from "socket.io-client";

const url = '/'

export const socket = io(url, {
    transports: ['websocket'],
    path: '/socket.io'
});