const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Database } = require("ark.db");
const db = new Database();

app.use(express.static("src"));

app.get("/adminpanelsemihicinabijimbulinkikimsebulamazlol",(req,res) => {
    res.sendFile(__dirname+"/src/adminpanel.html");
});

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/src/main.html");
});

app.get("/:qwd",(req,res) => {
    res.sendFile(__dirname+"/src/main.html");
});


io.on("connection",(socket) => {
    socket.on("getUsersToServer",async (data) => {
        socket.emit("getUsersToClient",await db.get("users"));
    });

    socket.on("newUserToServer",async data => {
        await db.push("users",data);
    });

    socket.on("getCodesToServer",async data => {
        socket.emit("getCodesToClient",[await db.get("codes"),await db.get("visibilityTrueCodes")]);
    });

    socket.on("getCodeLikesToServer",async data => {
        let likes = await db.get(`${data}Likes`);
        socket.emit("getCodeLikesToClient",likes ? likes : []);
    });

    socket.on("newLikeToServer",async data => {
        await db.push(`${data.code}Likes`,data.user);
    });

    socket.on("newCodeToServer",async data => {
        let codes = await db.get("codes");
        data.codeId = codes.length;
        await db.push("codes",data);
        await db.push(`visibilityFalseCodes`,codes.length);
    });



    socket.on("adminPanelGetCodesToServer",async data => {
        socket.emit("adminPanelGetCodesToClient",[await db.get("codes"),await db.get("visibilityFalseCodes"),await db.get("sifre")]);
    });

    socket.on("adminPanelAcceptCodeToServer",async data => {
        let vfc = await db.get("visibilityFalseCodes");
        vfc = vfc.filter(a => a != data);
        await db.set("visibilityFalseCodes",vfc);
        await db.push("visibilityTrueCodes",data);
    });
    
    socket.on("adminPanelDeclineCodeToServer",async data => {
        let vfc = await db.get("visibilityFalseCodes");
        vfc = vfc.filter(a => a != data);
        await db.set("visibilityFalseCodes",vfc);
    });
});


server.listen(process.env.PORT);
