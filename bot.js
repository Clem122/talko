const discord = require("discord.js")
const client = new discord.Client()
const config = require('./config.json')

client.on('ready', () => {
    bot.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
})

bot.login(process.env.BOT_TOKEN);
