const discord = require("discord.js")
const client = new discord.Client()
const ms = require("ms");
const fs = require("fs");
const Canvas = require('canvas');
const prefix = "$";

 client.on("guildMemberAdd", (member) => {

    let channel = client.channels.get('922288183172014131');

    channel.send(`d ${member.user}, dd`); 
});

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
});

client.on("ready", () => {
    client.user.setStatus("dnd");
});

client.on('ready', () => {
    client.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.login(process.env.BOT_TOKEN);
