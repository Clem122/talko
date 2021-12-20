const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "$";

client.on('ready', () => {
    client.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
})

client.on("ready", () => {
    client.user.setStatus("dnd");
})

client.login(process.env.BOT_TOKEN);
