const discord = require("discord.js")
const config = require('./config.json')
const client = new Discord.Client();

client.on('ready', () => {
    clientt.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
});

client.on('message', message => {
    if(message.content === "!ping") {
        message.channel.send("pong!")
    }
});

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config.guild) return
    const welcomemsg = `**Hej! Zweryfikuj konto** Pamiętaj, aby przed weryfikacją zerknąć na kanał \`#zasady\` i \`#informacje\` \n\n Weryfikując swoje konto oświadczasz, że masz minimum 13 lat, proszę przepisz poniższy kod. \n\n\`${token}\` \n\n\Nie możesz się zweryfikować? Skontaktuj się z administratorem serwera..`
    member.send(welcomemsg)
});

client.on("ready", () => {
    client.user.setStatus("dnd");
});

client.login(process.env.BOT_TOKEN);
