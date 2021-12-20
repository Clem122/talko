const discord = require("discord.js")
const client = new discord.Client()

client.on('ready', () => {
    bot.user.setActivity("jablonska to kurwa")
    console.log("siema byku")
})

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
})

client.login(process.env.BOT_TOKEN);
