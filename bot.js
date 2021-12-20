const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json')
const ms = require("ms");
const fs = require("fs");
const Canvas = require('canvas');
const Enmap = require("enmap");  
client.points = new Enmap({ name: "points" });
const canvacord = require("canvacord");
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
	let fontSize = 35

	do {
		ctx.font = `${fontSize -= 10}px Genta`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'witamy');
	if (!channel) return;

	const canvas = Canvas.createCanvas(800, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./welcome-image.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.font = '37px Genta';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Witaj na serwerze', canvas.width / 3.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 3.5, canvas.height / 1.7);

	ctx.beginPath();
	ctx.arc(120, 125, 90, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 20, 25, 190, 190);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), '/welcome-image.png');

	channel.send(`:eggplant: **${member}** **Surprise bitch! I bet you thought you'd seen the last of me.**  Jesteś ${member.guild.memberCount} członkiem`, attachment);
});

  client.on("message", async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channel.type === `dm`) return;
    //////////////////////////////////////////
    /////////////RANKING SYSTEM///////////////
    //////////////////////////////////////////
    //get the key of the user for this guild
    const key = `${message.guild.id}-${message.author.id}`;
    // do some databasing
    client.points.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    //create message length basically math for not too much xp for too long messages
    var msgl = message.content.length / (Math.floor(Math.random() * (message.content.length - message.content.length / 100 + 1) + 10));
    //if too short the message
    if (msgl < 10) {
      //get a random num between 0 and 2 rounded
      var randomnum = Math.floor((Math.random() * 2) * 100) / 100
      //basically databasing again
      client.points.math(key, `+`, randomnum, `points`)
      client.points.inc(key, `points`);
    }
    //if not too short do this
    else {
      //get a random num between rounded but it belongs to message length
      var randomnum = 1 + Math.floor(msgl * 100) / 100
      //basically databasing again
      client.points.math(key, `+`, randomnum, `points`)
      client.points.inc(key, `points`);
    }
    //get current level
    const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, `points`)));
    //if its a new level then do this
    if (client.points.get(key, `level`) < curLevel) {
      //define ranked embed
      const embed = new Discord.MessageEmbed()
        .setTitle(`Level:  ${message.author.username}`)
        .setTimestamp()
        .setDescription(`Właśnie zdobyłeś nowy poziom!: **\`${curLevel}\`**! (Points: \`${Math.floor(client.points.get(key, `points`) * 100) / 100}\`) `)
        .setColor("BLACK");
      //send ping and embed message
      message.channel.send(`<@` + message.author.id + `>`);
      message.channel.send(embed);
      //set the new level
      client.points.set(key, curLevel, `level`);
    }
    //else continue or commands...
    //
    if (message.content.toLowerCase().startsWith(`${config.PREFIX}poziom`)) {
      //get the rankuser
      let rankuser = message.mentions.users.first() || message.author;
      client.points.ensure(`${message.guild.id}-${rankuser.id}`, {
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1
      });
      //do some databasing
      const filtered = client.points.filter(p => p.guild === message.guild.id).array();
      const sorted = filtered.sort((a, b) => b.points - a.points);
      const top10 = sorted.splice(0, message.guild.memberCount);
      let i = 0;
      //count server rank sometimes an error comes
      for (const data of top10) {
        await delay(15);
        try {
          i++;
          if (client.users.cache.get(data.user).tag === rankuser.tag) break;
        } catch {
          i = `Error`;
          break;
        }
      }
      const key = `${message.guild.id}-${rankuser.id}`;
      //math
      let curpoints = Number(client.points.get(key, `points`).toFixed(2));
      //math
      let curnextlevel = Number(((Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)) * ((Number(1) + Number(client.points.get(key, `level`).toFixed(2))) * Number(10)));
      //if not level == no rank
      if (client.points.get(key, `level`) === undefined) i = `No Rank`;
      //define a temporary embed so its not coming delayed
      let tempmsg = await message.channel.send(new Discord.MessageEmbed().setColor("RED").setAuthor("Ciągi, wzory i dziedzina szlugi talko kokaina", "https://cdn.discordapp.com/emojis/769935094285860894.gif"))
      //global local color var.
      let color;
      //define status of the rankuser
      let status = rankuser.presence.status;
      //do some coloring for user status cause cool
      if (status === "dnd") { color = "#FFFFFF"; }
      else if (status === "online") { color = "#FFFFFF"; }
      else if (status === "idle") { color = "#FFFFFF"; }
      else { status = "streaming"; color = "#FFFFFF"; }
      //define the ranking card
      const rank = new canvacord.Rank()
        .setAvatar(rankuser.displayAvatarURL({ dynamic: false, format: 'png' }))
        .setCurrentXP(Number(curpoints.toFixed(2)), color)
        .setRequiredXP(Number(curnextlevel.toFixed(2)), color)
        .setStatus(status, false, 7)
        .renderEmojis(true)
        .setProgressBar('#DDA0DD', "COLOR")
        .setRankColor(color, "COLOR")
        .setLevelColor(color, "COLOR")
        .setUsername(rankuser.username, color)
        .setRank(Number(i), "Twoja ranga", true)
        .setLevel(Number(client.points.get(key, `level`)), "Level", true)
        .setDiscriminator(rankuser.discriminator, color);
      rank.build()
        .then(async data => {
          //add rankcard to attachment
          const attachment = new Discord.MessageAttachment(data, "poziom.png");
          //define embed
          const embed = new Discord.MessageEmbed()
            .setTitle(`Poziom użytkownika:  ${rankuser.username}`)
            .setColor(color)
            .setImage("attachment://poziom.png")
            .attachFiles(attachment)
          //send that embed
          await message.channel.send(embed);
          //delete that temp message
          await tempmsg.delete();
          return;
        });
    }
    //leaderboard command
    if (message.content.toLowerCase() === `${config.PREFIX}topka`) {
      //some databasing and math
      const filtered = client.points.filter(p => p.guild === message.guild.id).array();
      const sorted = filtered.sort((a, b) => b.points - a.points);
      const top10 = sorted.splice(0, 10);
      const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}: Top 10 najwspnialszych użytkowników:`)
        .setTimestamp()
        .setColor("BLACK");
      //set counter to 0
      let i = 0;
      //get rank 
      for (const data of top10) {
        await delay(15); try {
          i++;
          embed.addField(`**${i}**. ${client.users.cache.get(data.user).tag}`, `Punkty: \`${Math.floor(data.points * 100) / 100}\` | Poziom: \`${data.level}\``);
        } catch {
          i++; //if usernot found just do this
          embed.addField(`**${i}**. ${client.users.cache.get(data.user)}`, `Punkty: \`${Math.floor(data.points * 100) / 100}\` | Poziom: \`${data.level}\``);
        }
      }
      //schick das embed
      return message.channel.send(embed);
    }
	  
        if (message.content.toLowerCase() === `${config.PREFIX}registerall`) {
            let allmembers = message.guild.members.cache.keyArray();
            for (let i = 0; i < allmembers.length; i++) {
                //Call the databasing function!
                let rankuser = message.guild.members.cache.get(allmembers[i]).user;
                databasing(rankuser);
            }
            const embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setDescription(`Successfully registered everyone`)
            message.reply(embed);
        }

        if (message.content.toLowerCase() === `${config.PREFIX}resetrankingall`) {
            let allmembers = message.guild.members.cache.keyArray();
            for (let i = 0; i < allmembers.length; i++) {
                let rankuser = message.guild.members.cache.get(allmembers[i]).user;
                const key = `${message.guild.id}-${rankuser.id}`;
                client.points.set(key, 1, `level`); //set level to 0
                client.points.set(key, 0, `points`); //set the points to 0
                client.points.set(key, 400, `neededpoints`) //set neededpoints to 0 for beeing sure
                client.points.set(key, "", `oldmessage`); //set old message to 0
            }
            const embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .setDescription(`Successfully resetted everyone`)
            message.reply(embed);
        }

  })
  function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

client.on("ready", () => {
    client.user.setStatus("dnd");
});

client.on('ready', () => {
    client.user.setActivity("jablonska kurewica")
    console.log("Logged in successfully :D")
})

client.login(process.env.BOT_TOKEN);
