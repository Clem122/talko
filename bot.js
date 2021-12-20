const discord = require("discord.js")
const client = new discord.Client()
const config = require('./config.json')
const ms = require("ms");
const fs = require("fs");
const Canvas = require('canvas');
const prefix = "$";

const completemsg = `Zostałeś pomyślnie zweryfikowany. Dziękujemy! \nTeraz możesz udać się na serwer i wybrać rangi które cię interesują. Nie zapomnij napisać Cześć do wszystkich!`

const shortcode = (n) => {
    const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
}

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config.guild) return
    const token = shortcode(8)
    const welcomemsg = `**Hej! Zweryfikuj konto** Pamiętaj, aby przed weryfikacją zerknąć na kanał \`#regulamin\` i \`#informacje\` \n\n Weryfikując swoje konto oświadczasz, że masz minimum 13 lat, proszę przepisz poniższy kod. \n\n\`${token}\` \n\n\Nie możesz się zweryfikować? Skontaktuj się z administratorem serwera..`
    console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`)
    member.send(welcomemsg)
    member.user.token = token
})

const verifymsg = '{token}'

client.on('message', (message) => {
    if (message.author.bot || !message.author.token || message.channel.type !== `dm`) return
    if (message.content !== (verifymsg.replace('{token}', message.author.token))) return
    message.channel.send({
        embed: {
            color: Math.floor(Math.random() * (0xFFFFFF + 1)),
            description: completemsg,
            timestamp: new Date(),
            footer: {
                text: `Przepisując kod automatycznie zaakceptowałeś regulamin serwera.`
            }
        }
    })
    let czlonek = client.roles.cache.find(r => r.name === 'członek') || client.roles.fetch('922282005385863190');
    member.roles.add(czlonek);
})

client.on('disconnect', (event) => {
    setTimeout(() => client.destroy().then(() => client.login(config.token)), 10000)
    console.log(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`)
})

client.on('reconnecting', () => {
    console.log(`[NOTICE] ReconnectAction: Reconnecting to Discord...`)
})

client.on('error', console.error)
client.on('warn', console.warn)

process.on('unhandledRejection', (error) => {
    console.error(`Uncaught Promise Error: \n${error.stack}`)
})

process.on('uncaughtException', (err) => {
    let errmsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
    console.error(errmsg)
})

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
