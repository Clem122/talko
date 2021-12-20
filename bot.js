const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
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

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config.guild) return
    const welcomemsg = `**Hej! Zweryfikuj konto** Pamiętaj, aby przed weryfikacją zerknąć na kanał \`#zasady\` i \`#informacje\` \n\n Weryfikując swoje konto oświadczasz, że masz minimum 13 lat, proszę przepisz poniższy kod. \n\n\`${token}\` \n\n\Nie możesz się zweryfikować? Skontaktuj się z administratorem serwera..`
    member.send(welcomemsg)
})

client.on("ready", () => {
    client.user.setStatus("dnd");
})

client.login(process.env.BOT_TOKEN);
