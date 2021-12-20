const discord = require("discord.js")
const client = new discord.Client()
const config = '922242038722887751')
const ms = require("ms");
const fs = require("fs");
const Canvas = require('canvas');
const prefix = "$";

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config) return
    const welcomemsg = `**Hej! Zweryfikuj konto** Pamiętaj, aby przed weryfikacją zerknąć na kanał \`#zasady\` i \`#informacje\` \n\n Weryfikując swoje konto oświadczasz, że masz minimum 13 lat, proszę przepisz poniższy kod. \n\n\`${token}\` \n\n\Nie możesz się zweryfikować? Skontaktuj się z administratorem serwera..`
    console.log(`${member.user.username}#${member.user.discriminator} joined!`)
    member.send(welcomemsg)
})

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
})

client.on("ready", () => {
    client.user.setStatus("dnd");
})

client.on('ready', () => {
    client.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.login(process.env.BOT_TOKEN);
