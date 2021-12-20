const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json')
const ms = require("ms");
const fs = require("fs");
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const verified_role_id = "922282005385863190";
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
    client.guilds.cache.get(config.guild).member(message.author).roles.add(config.role) // ensure this is a string in the config ("")
    client.guilds.cache.get(config.guild).member(message.author).roles.remove(config.role2) // ensure this is a string in the config ("")
        .then(console.log(`TOKEN: ${message.author.token} :: Role ${config.role} added to member ${message.author.id}`))
        .catch(console.error)
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

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px Genta`;
	} while (ctx.measureText(text).width > canvas.width - 400);

	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const images = ["welcome-image.png", "regulamin", "Image3", "Image4" ];
	const image = Math.floor(Math.random() * images.length);
	const channel = member.guild.channels.cache.find(ch => ch.name === 'witamy');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./welcome-image.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.font = '36px Genta';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Witaj na serwerze', canvas.width / 3, canvas.height / 3.7);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 4.2, canvas.height / 1.7);

	ctx.beginPath();
	ctx.arc(120, 125, 90, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	
	const textString4 = `Jesteś #${member.guild.memberCount}`;
      	ctx.font = 'bold 40px Genta';
     	ctx.fillStyle = '#f2f2f2';
      	ctx.fillText(`${member.displayName}!`, canvas.width / 3, canvas.height / 1);
	
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 20, 25, 190, 190);
	
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '/welcome-image.png');

	channel.send(`:eggplant: **${member}** **Surprise bitch! I bet you thought you'd seen the last of me.**  Jesteś ${member.guild.memberCount} członkiem`, attachment);
});

client.on("ready", () => {
    client.user.setStatus("dnd");
});

client.on('ready', () => {
    client.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.login(process.env.BOT_TOKEN);
