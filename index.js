const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");


const app =express();  //calling express
const port = 4500 || process.env.PORT;

const users=[{}];

//cors is used for inter communication b/w url
app.use(cors());

app.get("/",(req,res)=>{
    res.send("hell is working");
})

const server=http.createServer(app);

// io matlab connection ho gaya
//ek circuit bana diya io ka
const io = socketIO(server);

//jab circuit on ho
io.on("connection",(socket)=>{
    console.log("new connection");

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        //emit jis user ne bheja hai sirf use jaayega
        socket.emit('welcome',{user:"Admin",message:`welcome to the chat, ${users[socket.id]}` });
    })

    socket.on('message',({message,id})=>{
        //io.emit--> with this msg will send to all the person even to that person who send that msg 
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconnected',()=>{
        //jo leave kar raha hai usko chor ke baake sab ko send karna hai msg so use broadcast
        //yeh  msg admin bhej raha  hai
        //object hai yeh user and message
        socket.broadcast.emit('leave',{user:"Admin",message:` has left`}); 
        // console.log('user left');
    })
})


server.listen(port, ()=>{
    console.log(`server is working on ${port}`);
})