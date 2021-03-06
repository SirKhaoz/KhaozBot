const botSettings = require("./resources/keys.json");
const Discord = require("discord.js");
const fs = require("fs");
const googleTTS = require('google-tts-api');
const twitch = require("./cmds/twitch.js");
const lollivegame = require("./cmds/lgtest.js");
const CronJob = require('cron').CronJob;
const CronParser = require('cron-parser');
const table = require("as-table");
const prefix = botSettings.prefix;

//new bot object, specific argument to allow for increased latency (600ms).
bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] },{restTimeOffset: 600});

bot.commands = new Discord.Collection();
bot.helps = new Discord.Collection();
bot.example = new Discord.Collection();
bot.detail = new Discord.Collection();
var tickinterval = 55000;
const talkedRecently = new Set();

bot.login(botSettings.token);

//Load all required resources, declare musicguilds/userchannels
//userchannels used for short memory of where to move a user back to after defen
bot.mutes = require("./mutes.json");
bot.guildSettings = require("./guildSettings.json");
bot.miscsettings = require("./resources/botmiscsettings.json");
bot.authusers = require("./resources/authorisedusers.json");
bot.logitems = require("./resources/logitems.json");
bot.logusers = require("./resources/logusers.json");
bot.bdoplayers = require("./resources/bdoplayers.json");
bot.reminders = require("./resources/reminders.json");
bot.lolaccounts = require("./resources/lolaccounts.json");
bot.savedmessages = require("./resources/savedmessages.json");
bot.bdobossesinfo = require("./resources/bdobosses.json");
bot.birthdays = require("./resources/birthdays.json");
bot.bossescrons = [];
bot.musicguilds = {};
bot.userchannels = {};
bot.twitchOauth;

//Load all commands from /cmds/ dir.
fs.readdir("./cmds/", (err, files) => {
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	//Print load of commands
	console.log(`Loading ${jsfiles.length} commands...`);

	jsfiles.forEach((f,i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
		bot.helps.set(props.help.desc, props);
		bot.example.set(props.help.example, props);
		bot.detail.set(props.help.detail, props)
	});
});

function sendbossping(boss, time, timetoboss, alertmessage){
	bot.guilds.cache.forEach(g => {
		if(!bot.guildSettings[g.id].bdobossping.sendpings) return;
		try{
			let channel = g.channels.cache.get(bot.guildSettings[g.id].bdobossping.bosstimerchannel);
			if (!channel) {
				bot.guildSettings[g.id].bdobossping.bosstimerchannel = null;
				bot.guildSettings[g.id].bdobossping.sendpings = false;
				channel = g.channels.cache.get(bot.guildSettings[g.id].defaultchannel);
				return channel.send("No channel set for bosstimers/prings. Use ''!set bdobosstimerchannel' in the desired channel.")
			}

			let roles = "";
			bot.guildSettings[g.id].bdobossping.roles.forEach(r => {
				roles += `<@&${r}>, `;
			});

			let htoboss = Math.floor(timetoboss / 60);
			let mtoboss = timetoboss % 60;
			let ttobossformated = "";
			if(htoboss == 1) ttobossformated += `${htoboss} hour`
			if(htoboss >> 1) ttobossformated += `${htoboss} hours`
			if(htoboss >= 1 && mtoboss > 0) ttobossformated += ` and `
			if(mtoboss == 1) ttobossformated += `${mtoboss} minute`
			if(mtoboss >> 1) ttobossformated += `${mtoboss} minutes`

			let bdobosspingmessage;
			if(!alertmessage) alertmessage = "is going to spawn in";
			bdobosspingmessage = `${roles}\nAlert! **${boss}** ${alertmessage} **${ttobossformated}** @\n${time}`;
			channel.send(bdobosspingmessage).then(m => {
				let timestamp = m.createdTimestamp - 1123200000 - 75600000;
				bot.savedmessages.messages.push({"guildid":m.guild.id,"channelid":m.channel.id,"id":m.id,"timestamp":timestamp});
			});
		}catch(e){
			console.error(e);
		}
	});
}

setInterval(twitch.tick, tickinterval);
//setInterval(lollivegame.tick, tickinterval);

bot.on("ready", async () => {
	console.log(`Bot is ready! ${bot.user.username}`);

	bot.user.setActivity(bot.miscsettings.activity);

	let guildIDs = bot.guilds.cache.map(g => g.id);
	let txtchannelIDs = {};

	bot.guilds.cache.forEach(g=>{
	    txtchannelIDs[g.id] = g.channels.cache.filter(c=>c.type === 'text').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c.id);
	});
	let voicechannelIDs = {};
	bot.guilds.cache.forEach(g=>{
	    voicechannelIDs[g.id] = g.channels.cache.filter(c=>c.type === 'voice').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c.id);
	    if(voicechannelIDs[g.id].length == 0) voicechannelIDs[g.id][0] = null;
	});

	for(let j in guildIDs){
		if (!bot.guildSettings[guildIDs[j]]){
			bot.guildSettings[guildIDs[j]] = {
				guildID: guildIDs[j],
				defaultchannel: txtchannelIDs[guildIDs[j]][0],
				joinmessage: {send: true, channel: txtchannelIDs[guildIDs[j]][0], message: "Welcome to the server... {{{user}}}"},
				leavemessage: {send: true, channel: txtchannelIDs[guildIDs[j]][0], message: "Rip, cy@ nerd, {{{user}}} has left."},
				adminchannel: txtchannelIDs[guildIDs[j]][0],
				birthdaychannel: txtchannelIDs[guildIDs[j]][0],
				twitchchannel: txtchannelIDs[guildIDs[j]][0],
				touretteschannel: voicechannelIDs[guildIDs[j]][0],
				afkchannel: voicechannelIDs[guildIDs[j]][voicechannelIDs[guildIDs[j]].length - 1],
				botchannel: txtchannelIDs[guildIDs[j]][0],
				musicchannel: txtchannelIDs[guildIDs[j]][0],
				leaguechannel: txtchannelIDs[guildIDs[j]][0],
				bdochannel: txtchannelIDs[guildIDs[j]][0],
				bdobossping: {sendpings: false, roles:[], bosstimerchannel: txtchannelIDs[guildIDs[j]][0], sendschedule: false, lastmessage: {id:null,channel:null}, bosses:{kzarka:true,nouver:true,kutum:true,karanda:true,vell:true,garmoth:true,offin:true,quint:true,muraka:true}},
				movecommands: false,
				twitchChannels: [],
				summonerNames: [],
				commandlocked: [],
				autopurge: false,
				autopurgechannels: [],
				queue: [],
				botVolume: botSettings.volume,
				repeat: false,
				rolemessage: {messageid: null, channelid: null, messagebody: null, pmadd: null, pmremove: null, roles: []},
				welcomemessage: {messageid: null, channelid: null, messagebody: null, pmadd: "{{{emoji}}}  Welcome to {{{servername}}}!  {{{emoji}}}", pmremove: "{{{emoji}}}  you have left {{{servername}}}.  {{{emoji}}}",anyemoji: false, emojis: [], roles: []}
			}
		}
		if (!bot.musicguilds[guildIDs[j]]){
			bot.musicguilds[guildIDs[j]] = {
				isPlaying: false,
				isPaused: false,
				dispatcher: null,
				notification: null,
				voiceChannel: null,
				notifChannel: null
			}
		}
	};

	Object.keys(bot.bdobossesinfo).forEach(async b => {
		bot.bdobossesinfo[b].times.forEach(t => {
			if(t.announce){
				let cronarray = t.cron.split(' ')
				cronarray[2] = parseInt(cronarray[2]) + 2//+1 for Daylight Savings Time (DST)
				if(bot.bdobossesinfo[b].delay > 0){
					cronarray[1] = cronarray[1] - bot.bdobossesinfo[b].delay % 60;
					cronarray[2] = cronarray[2] - Math.floor(bot.bdobossesinfo[b].delay / 60);
					if(Math.sign(cronarray[1]) < 0){
						cronarray[1] = cronarray[1] + 60;
						cronarray[2] = cronarray[2] - 1;
					}
					if(Math.sign(cronarray[2]) < 0){
						cronarray[2] = cronarray[2] + 24;
						cronarray[5] = cronarray[5] - 1;
					}
					if(Math.sign(cronarray[5]) < 0) cronarray[5] = cronarray[5] + 7;
					cronarray = cronarray.join(' ')

					let cronexists = false;
					bot.bossescrons.forEach(c => {
						if(cronarray == c.cron) {
							cronexists = true;
							c.name += ` & ${bot.bdobossesinfo[b].name}`
							//maybe merge message for both bosses here too if needed ...
						}
					});

					if(!cronexists){
						bot.bossescrons.push({cron:cronarray,name:bot.bdobossesinfo[b].name,message:bot.bdobossesinfo[b].message,delay:bot.bdobossesinfo[b].delay});
					}
				}
			}
		});
	});

	bot.bossescrons.forEach(async b => {
		new CronJob(b.cron, function() {
			sendbossping(b.name, new Date(new Date().getTime() + b.delay*60000), b.delay, b.message);
			},null,null,"Pacific/Auckland"
		).start();
	});

	bot.setInterval(() => {
		bot.guilds.cache.forEach(g => {
			if(!bot.guildSettings[g.id].bdobossping.sendschedule) return; //if false, exit
			let channel = g.channels.cache.get(bot.guildSettings[g.id].bdobossping.bosstimerchannel);
			if(!channel){
				bot.guildSettings[g.id].bdobossping.sendschedule = false;
				bot.guildSettings[g.id].bdobossping.bosstimerchannel = null;
				return g.channels.cache.get(bot.guildSettings[g.id].defaultchannel).send(`BDO Boss timers are enabled, but the channel has been deleted. Please !set bdobosstimerchannel.\n\
**To prevent spam, sendschedule has been turned off. Re-enable it with !set bdosendschedule.**`);
			}

			Object.keys(bot.bdobossesinfo).forEach(async b => {
				let nexttimesunfiltered = [];
				bot.bdobossesinfo[b].times.forEach(t => {
					let cronarray = t.cron.split(' ');
					//cronarray[2] = parseInt(cronarray[2]) + 1; //+1 for Daylight Savings Time (DST)
					cronarray[2] = ((parseInt(cronarray[2]) + 2) >= 24) ? 0 : parseInt(cronarray[2]) + 2; //+1 for Daylight Savings Time (DST)
					cronarray = cronarray.join(' ');
					let date = CronParser.parseExpression(cronarray,{currentDate: Date.now(),tz: 'Pacific/Auckland'});
					 nexttimesunfiltered.push(Date.parse(date.next().toString()));
				});
				nexttimesunfiltered.sort(function(a,b){
				  return a - b;
				});
				bot.bdobossesinfo[b].nexttime = nexttimesunfiltered[0];
			});

			let bossesnexttimes = [];
			Object.keys(bot.bdobossesinfo).forEach(async b => {
				bossesnexttimes.push({name:bot.bdobossesinfo[b].name,nexttime:bot.bdobossesinfo[b].nexttime})
			});

			bossesnexttimes.sort(function(a,b){
			  return a.nexttime - b.nexttime;
			});

			let bdobossembed = new Discord.MessageEmbed()
				.setTitle(`📅   BDO World Boss & Event Schedule:`)
				.setThumbnail(`http://getdrawings.com/free-icon-bw/bdo-icon-17.png`)
				.setColor("#ffff00")
				.setTimestamp(`${Date.now()}`)

			let data = [];
			bossesnexttimes.forEach(b => {
				let timetoboss = Math.round((b.nexttime - Date.now()))
				let days = Math.floor(timetoboss / (24*60*60*1000));
				var d, h, m, s;
				s = Math.floor(timetoboss / 1000);
				m = Math.floor(s / 60);
				s = s % 60;
				h = Math.floor(m / 60);
				m = m % 60;
				d = Math.floor(h / 24);
				h = h % 24;

				timetoboss = ``;
				if(d > 0) timetoboss += `${d} days, `
				if(h > 0) timetoboss += `${h} hours, `
				timetoboss += `${m} mins`
				data.push([b.name,`in ${timetoboss}`])
			});

			let nextmessage = "Next boss:";
			let singlebosses = [];

			data = getUniqueArray(data, []) //remove duplicates

			singlebosses.push(data[0]);
			data.shift();

			if(singlebosses[0][1] == data[0][data[0].length-1]){
				nextmessage = "Next events (happening at the same time):";
				singlebosses.push(data[0]);
				data.shift();
			}

			bdobossembed.addField(nextmessage,`\`\`\`js\n${table(singlebosses)}\`\`\``)
			bdobossembed.addField("Upcoming bosses/events, in order:",`\`\`\`js\n${table(data)}\`\`\``)

			channel.messages.fetch(bot.guildSettings[g.id].bdobossping.lastmessage.id).then(async m => {
				m.edit(bdobossembed);
			}).catch(e => {
				console.error("I had to set up another BDO boss timer embed on '" + g.name + "', ID: " + g.id, e)
				channel.send(bdobossembed).then(m => {
					bot.guildSettings[g.id].bdobossping.lastmessage.id = m.id;
					bot.guildSettings[g.id].bdobossping.lastmessage.channel = m.channel.id;
				});
			});
		});
	}, 55000);

	bot.setInterval(() => {
		const today = new Date()
		for(let i in bot.birthdays){
			let birthdate = new Date(bot.birthdays[i].date)
			let isToday = birthdate.getDate() == today.getDate() && birthdate.getMonth() == today.getMonth()
			if(isToday && !bot.birthdays[i].announcedcurrentyear){
				bot.guilds.cache.forEach(async g => {
					if(g.id != 209104845859323906) return
					if(g.member(i)){
						let birthdayembed = new Discord.MessageEmbed()
							.setDescription(`------- HAPPY BIRTHDAY IDIOT! -------`)
							.setColor("#FFFFFF")
							.addField(`HAPPY BIRTHDAY TO:`, `<@${i}>! They've turned ${today.getYear()-birthdate.getYear()} today!`)
							.setThumbnail(`https://media0.giphy.com/media/3ohs7W7ACsSvyY5WoM/giphy.gif?cid=ecf05e47429a0b8f63f6c00644641f2b32c90d0c698f9821&rid=giphy.gif`)
							.setImage("https://media3.giphy.com/media/yoJC2GnSClbPOkV0eA/giphy.gif?cid=ecf05e4779f91cd2c5c9f07f334066e346b6006d9edd35aa&rid=giphy.gif")
						g.channels.cache.get(bot.guildSettings[g.id].birthdaychannel).send(`Shameless @everyone ping!`,birthdayembed)
					}
				})
				bot.birthdays[i].announcedcurrentyear = true;
			}else if(!isToday){
				bot.birthdays[i].announcedcurrentyear = false;
			}
		}
	}, 65000);

	bot.setInterval(() => {
		for(let i in bot.mutes){
			let time = bot.mutes[i].time;
			let guildId = bot.mutes[i].guild;
			let guild = bot.guilds.cache.get(guildId);
			let member = guild.members.cache.get(i);
			let mutedRole = guild.roles.cache.find(r => r.name === "Muted");
			if(!mutedRole) continue;
			if(!guild) continue;

			if(Date.now() > time) {
				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 3), err => {
					if(err) throw err;
					console.log(`I have unmuted ${member.user.tag}.`);
				});
			}
		}

		for(let i in bot.reminders){
			let time = bot.reminders[i].time;
			let guild = bot.guilds.cache.get(bot.reminders[i].guild);
			let channel = guild.channels.cache.get(bot.reminders[i].channel);
			let member = guild.members.cache.get(i);
			let reminder = bot.reminders[i].reminder;
			if(!guild) continue;

			if(Date.now() >= time) {
				delete bot.reminders[i];

				let reminderembed = new Discord.MessageEmbed()
				//.setThumbnail(`${summonericonurl}`)
				.setTitle(`I was told to remind you of something:`)
				.setColor("#ffff00")
				.setDescription(`**Reminder: ${reminder}**`, `Reminder was set for: ${new Date(time).toLocaleString()}`, true)

				channel.send(`Reminder for ${member} below:`, {tts: true});
				channel.send(reminderembed);

				let language = "en-US";
				if(i == 98595901055959040) language = "ja-JP";
				if(i == 177621692191997952) language = "pt-BR";

				if(member.voice.channel){
					bot.musicguilds[guild.id].notifChannel = member.voice.channel;
					bot.musicguilds[guild.id].notifChannel.join().then(function(connection) {
						googleTTS(`...You have a reminder, ${member.displayName}. Please check the ${channel.name} channel...`, language, 1).then((url) => {
							bot.musicguilds[guild.id].notification = connection.play.stream(url, {passes: 5});
							bot.musicguilds[guild.id].notification.setVolume(1);
							bot.musicguilds[guild.id].notification.on('error', e => console.log(e));
							bot.musicguilds[guild.id].notification.on('debug', d => console.log(d));
							bot.musicguilds[guild.id].notification.on('end', () => {
								connection.disconnect;
								bot.musicguilds[guild.id].notifChannel.leave();
							});
						});
					});
				}
			}
		}

		fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/logitems.json", JSON.stringify(bot.logitems, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/logusers.json", JSON.stringify(bot.logusers, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/bdoplayers.json", JSON.stringify(bot.bdoplayers, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/reminders.json", JSON.stringify(bot.reminders, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/lolaccounts.json", JSON.stringify(bot.lolaccounts, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/savedmessages.json", JSON.stringify(bot.savedmessages, null, 3), err => {
			if(err) throw err;
		});
		fs.writeFile("./resources/birthdays.json", JSON.stringify(bot.birthdays, null, 3), err => {
			if(err) throw err;
		});
		console.log("Saved all files successfully.");
	}, 30000);

	bot.setInterval(() => {
		console.log("Saved messages contains:", bot.savedmessages.messages.length)
		bot.savedmessages.messages.forEach(async message => {
			//1209600000 = 2 weeks in MS
			if((Date.now() - message.timestamp) > 1209600000){
				console.log("Message ID: " + message.id + " is within timestamp paramater.")
				console.log("Trying to delete message ID: " + message.id, "On guild ID: " + message.guildid);
				let guild = bot.guilds.cache.get(message.guildid);
				if(guild){
					let channel = guild.channels.cache.get(message.channelid);
					if(channel){
						try{
							await channel.messages.fetch(message.id).then(m => {
								console.log("Found message: " + m);
								m.delete({timeout: 5000,reason:"auto-purged"}).then(m => {
									console.log("Deleted message: " + m);
								}).catch(console.error);
							});
						}catch(e){
							if(e.httpStatus = 404){
								console.error(e);
								console.log("Message already deleted, removing from savedmessages.")
							} else {
								console.log("Message could not be deleted with non 404 response:")
								console.error(e);
							}
						}finally{
							let arraypos = bot.savedmessages.messages.indexOf(message);
							bot.savedmessages.messages.splice(arraypos, 1);
						}
					} else {
						let arraypos = bot.savedmessages.messages.indexOf(message);
						bot.savedmessages.messages.splice(arraypos, 1);
					}
				} else {
					//If the guild doesnt exist, delete the message from the array.
					let arraypos = bot.savedmessages.messages.indexOf(message);
					bot.savedmessages.messages.splice(arraypos, 1);
				}
			}
		})
	}, 48000)

	try{
		let link = await bot.generateInvite(["ADMINISTRATOR"]);
		console.log("Link to add bot to server:");
		console.log(link);
	}catch(e){
		console.error(e.stack);
	}

});

//joined a server
bot.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);

		let txtchannelIDs = guild.channels.cache.filter(c=>c.type === 'text').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c.id);
		let voicechannelIDs = guild.channels.cache.filter(c=>c.type === 'voice').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c.id);
		if(voicechannelIDs.length == 0) voicechannelIDs[0] = null;

    bot.guildSettings[guild.id] = {
		guildID: guild.id,
		defaultchannel: txtchannelIDs[0],
		joinmessage: {send: true, channel: txtchannelIDs[0], message: "Welcome to the server... {{{user}}}"},
		leavemessage: {send: true, channel: txtchannelIDs[0], message: "Rip, cy@ nerd, {{{user}}} has left."},
		adminchannel: txtchannelIDs[0],
		birthdaychannel: txtchannelIDs[0],
		twitchchannel: txtchannelIDs[0],
		touretteschannel: voicechannelIDs[0],
		afkchannel: voicechannelIDs[voicechannelIDs.length - 1],
		botchannel: txtchannelIDs[0],
		musicchannel: txtchannelIDs[0],
		leaguechannel: txtchannelIDs[0],
		bdochannel: txtchannelIDs[0],
		bdobossping: {sendpings: false, roles:[], bosstimerchannel: txtchannelIDs[0], sendschedule: false, lastmessage: {id:null,channel:null}, bosses:{kzarka:true,nouver:true,kutum:true,karanda:true,vell:true,garmoth:true,offin:true,quint:true,muraka:true}},
		movecommands: false,
		twitchChannels: [],
		summonerNames: [],
		commandlocked: [],
		autopurge: false,
		autopurgechannels: [],
		queue: [],
		botVolume: botSettings.volume,
		repeat: false,
		rolemessage: {messageid: null, channelid: null, messagebody: null, pmadd: null, pmremove: null, roles: []},
		welcomemessage: {messageid: null, channelid: null, messagebody: null, pmadd: "{{{emoji}}}  Welcome to {{{servername}}}!  {{{emoji}}}", pmremove: "{{{emoji}}}  you have left {{{servername}}}.  {{{emoji}}}",anyemoji: false, emojis: [], roles: []}
	}
	bot.musicguilds[guild.id] = {
		isPlaying: false,
		isPaused: false,
		dispatcher: null,
		notification: null,
		voiceChannel: null,
		notifChannel: null
	}
})

//removed from a server
bot.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    delete bot.guildSettings[guild.id];
})

bot.on("guildMemberAdd", (member) => {
	if(!bot.guildSettings[member.guild.id].leavemessage.send) return;
	try{
		let channel;
		if (bot.guildSettings[member.guild.id].joinmessage.channel) {
			channel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].joinmessage.channel);
		}
		else if (bot.guildSettings[member.guild.id].defaultchannel) {
			channel = member.guild.channels.cache.filter(c => c.id == bot.guildSettings[member.guild.id].defaultchannel).first();
		} else {
			channel = member.guild.channels.cache.filter(c => c.type === 'text' && c.permissionsFor(member.guild.me).has(["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"])).sort((a, b) => a.calculatedPosition - b.calculatedPosition).first();
		}
		let joinmessage = bot.guildSettings[member.guild.id].joinmessage.message.replace(/{{{user}}}/gi, `<@${member.id}>`);
		channel.send(joinmessage);
	}catch(e){
		console.error(e);
	}
});

bot.on("guildMemberRemove", async (member) => {
	try{
		let leavetype = "Left";
		let entry = await member.guild
	    	.fetchAuditLogs({limit:5})
	    	.then(audit => audit.entries.filter(a => a.target == member.user).first());

		if(entry && (entry.action == "MEMBER_KICK" || entry.action == "MEMBER_BAN_ADD")){
			leavetype = (entry.action == "MEMBER_KICK") ? "Kicked" : "Banned";
			let kickReason = entry.reason;
			if (!kickReason || kickReason == "") kickReason = "No Reason Specified."

			let kickEmbed = new Discord.MessageEmbed()
				.setDescription(`--- ${leavetype.toUpperCase()}: ---`)
				.setColor((entry.action == "MEMBER_KICK") ? "#ffff00" : "#FF0000")
				.addField(`${leavetype} user:`, `${member} (${member.displayName}) with ID of ${member.id}`)
				.addField(`${leavetype} by:`, `${entry.executor}`)
				.addField("Time:", entry.createdAt)
				.addField("Reason:", kickReason);

			let adminChannel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].adminchannel);
			if(adminChannel) adminChannel.send(kickEmbed);
			leavetype += `, by: ${entry.executor}`
		}

		let channel;
		if (bot.guildSettings[member.guild.id].leavemessage.channel) {
			channel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].leavemessage.channel);
		}
		else if (bot.guildSettings[member.guild.id].defaultchannel) {
			channel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].defaultchannel);
		} else {
			channel = member.guild.channels.cache.filter(c => c.type === 'text' && c.permissionsFor(member.guild.me).has(["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"])).sort((a, b) => a.calculatedPosition - b.calculatedPosition).first();
		}
		if(bot.guildSettings[member.guild.id].leavemessage.send){
			let leavemessage = bot.guildSettings[member.guild.id].leavemessage.message.replace(/{{{user}}}/gi, `${member.user} (*${member.displayName}*)`);
			console.log(leavemessage)
			channel.send(`**(${leavetype})** - ${leavemessage}`).then(m => {
				if(leavetype != "Left") m.react("🇫");
				m.react("👋");
			});
		}

		let pmmessage = null;
		let midmessage = "left"
		if(entry.action == "MEMBER_KICK") midmessage = "been kicked from"
		if(entry.action == "MEMBER_BAN_ADD") midmessage = "been banned from"
		if(bot.guildSettings[member.guild.id].welcomemessage.messageid){
			let channel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].welcomemessage.channelid);
			channel.messages.fetch(bot.guildSettings[member.guild.id].welcomemessage.messageid).then(async msg => {
		    	let userReactions = await msg.reactions.cache.filter(reaction => reaction.users.cache.has(member.id));
					try {
						for(const reaction of userReactions.values()){
							await reaction.users.remove(member.id);
						}
					} catch (e){console.error(`Failed to remove welcome reactions when leaving ${member.guild.name}.`, e)}
					pmmessage = (`Your **welcome** roles have been stripped as you have ${midmessage} **${member.guild.name}**. You will need to re-react if you join again.`);
			}).catch(e => console.error(e));
		}
		if(bot.guildSettings[member.guild.id].rolemessage.messageid){
			let channel = member.guild.channels.cache.get(bot.guildSettings[member.guild.id].rolemessage.channelid);
			channel.messages.fetch(bot.guildSettings[member.guild.id].rolemessage.messageid).then(async msg => {
				let userReactions = await msg.reactions.cache.filter(reaction => reaction.users.cache.has(member.id));
				try {
					for(const reaction of userReactions.values()){
						await reaction.users.remove(member.id);
					}
				} catch (e){console.error(`Failed to remove role reactions when leaving ${member.guild.name}.`, e)}
		    pmmessage += (`\nYour **self-assigned** roles have been stripped as you have ${midmessage} **${member.guild.name}**. You will need to re-react if you join again.`);
			}).catch(e => console.error(e));
		}
		if(pmmessage) member.user.send(pmmessage);
	}catch(e){
		console.error(e);
	}
});

// bot.on("guildMemberUpdate", (oldmember, newmember) => {

// });

bot.on("voiceStateUpdate", (oldstate, newstate) => {
	try{
		if(!oldstate.selfDeaf && newstate.selfDeaf && oldstate.channelID != null){
			newstate.setChannel(bot.guildSettings[newstate.guild.id].afkchannel);
			bot.userchannels[oldstate.id] = oldstate.channelID;
		} else if (oldstate.selfDeaf && !newstate.selfDeaf && newstate.channelID == bot.guildSettings[newstate.guild.id].afkchannel){
			try{
				newstate.setChannel(bot.userchannels[oldstate.id]);
			} catch (e){
				newstate.setChannel(newstate.guild.channels.cache.filter(c=>c.type === 'voice').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c)[0]);
			}
		}
	}catch(e){
		console.error(e);
	}

	//Find the 'inthebin' role, if the role doesnt exist anymore, exit.
	let role = newstate.guild.roles.cache.find(r => r.name === "In The Bin");
	if(!role) return;
	//If the person who moved channel doesnt have the role, exit.
	if(!newstate.member.roles.cache.has(role.id)) return;
	//If the tourettes channel doesnt exist (never set - or deleted), exit.
	if (!newstate.guild.channels.cache.get(bot.guildSettings[newstate.guild.id].touretteschannel)) return;
	//If the new channel ID is not already 'inthebin' or in AFK, and they didnt leave voice, move them to the 'inthebinchannel'.
	if(newstate.channelID != bot.guildSettings[newstate.guild.id].touretteschannel && newstate.channelID != bot.guildSettings[newstate.guild.id].afkchannel && newstate.channelID != null){
		newstate.setChannel(bot.guildSettings[newstate.guild.id].touretteschannel);
	}
});

//Message event handler (on message, asyncronous function).
bot.on("message", async message => {
	//If the message was sent in a DM, ignore.
	if(message.channel.type === "dm") return; //Something to do here? What features can I utilze
	//add the message to the JSON list if auto-purge is on:
	//Check auto-purge on
	if(bot.guildSettings[message.guild.id].autopurge){
		//check if the schannel the message was sent was exempt from auto-purge
		let index = indexOfObjectByName(bot.guildSettings[message.guild.id].autopurgechannels, message.channel.id);
		//If the channel is not listed on the array for auto-purge exemption, add the message to a JSON-array; bot.savedmessages.messages
    if(index == -1) bot.savedmessages.messages.push({"guildid":message.guild.id,"channelid":message.channel.id,"id":message.id,"timestamp":message.createdTimestamp});
	}
	//If the message was sent by another bot, ignore. (But only after adding to the auto-purge list, if required).
	if(message.author.bot) return;
	//Break the message into an array, remove the first part as command, prepare the remainder to be sent to the command event.
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);
	//if the command does not start with the prefix, exit.
	if(!command.startsWith(prefix)) return;

	if (talkedRecently.has(message.author.id)) {
		message.delete();
		let msg = await message.reply(`Stop spamming. Max 1 command a second please.`);
		msg.delete(5000).catch(err => console.error(err));
		return;
	} else {
		talkedRecently.add(message.author.id);
		setTimeout(() => {
		  // Removes the user from the set after 1 second
		  talkedRecently.delete(message.author.id);
		}, 1000);
	}

	let cmd = bot.commands.get((command.slice(prefix.length)).toLowerCase());

	if(!cmd) {
		cmd = bot.commands.find(c => {
			return c.help.altname == (command.slice(prefix.length).toLowerCase())
		});
	}

	if(cmd) {
		let movechannel;
		if(cmd.help.name == "gear"){
			message.delete({timeout:5000}).catch(e => console.log(e));
		} else if (cmd.help.name == "clear") {
			//dont delete the !clear command, so it can get reliably picked up with bulkDelete();
		}	else {
			message.delete();
		}
		if(indexOfObjectByName(bot.guildSettings[message.guild.id].commandlocked, message.author.id) != -1){
			return message.reply(`You have been command locked, please see an admin.`).then(m => m.delete({timeout: 3000}).catch(e => console.error(e)));
		}
		if(bot.guildSettings[message.guild.id].movecommands){
			if(cmd.help.type == "command" && message.channel.id != bot.guildSettings[message.guild.id].botchannel){
				movechannel = await message.guild.channels.cache.get(bot.guildSettings[message.guild.id].botchannel);
				message.reply(`This command has been moved to ${movechannel}.`).then(m => m.delete({timeout: 15000}).catch(e => console.error(e)));
				message.channel = movechannel;
			} else if(cmd.help.type == "music" && message.channel.id != bot.guildSettings[message.guild.id].musicchannel){
				movechannel = await message.guild.channels.cache.get(bot.guildSettings[message.guild.id].musicchannel);
				message.reply(`This command has been moved to ${movechannel}.`).then(m => m.delete({timeout: 15000}).catch(e => console.error(e)));
				message.channel = movechannel;
			} else if(cmd.help.type == "bdo" && message.channel.id != bot.guildSettings[message.guild.id].bdochannel){
				movechannel = await message.guild.channels.cache.get(bot.guildSettings[message.guild.id].bdochannel);
				message.reply(`This command has been moved to ${movechannel}.`).then(m => m.delete({timeout: 15000}).catch(e => console.error(e)));
				message.channel = movechannel;
			}
		}
		cmd.run(bot, message, args, movechannel);
	}
});

bot.on('messageReactionAdd', async (reaction, user) => {
	if(user.bot)return;
	const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
	const guild = reaction.message.guild;
	const member = await guild.members.cache.get(user.id);
	let role;
	let message;
	if (reaction.message.id == bot.guildSettings[guild.id].welcomemessage.messageid) {
		if (bot.guildSettings[guild.id].welcomemessage.anyemoji || bot.guildSettings[guild.id].welcomemessage.emojis.includes(emoji)) {
			bot.guildSettings[guild.id].welcomemessage.roles.forEach(async r => {
				role = await guild.roles.cache.get(r);
				member.roles.add(role);
				let pmmessage = bot.guildSettings[guild.id].welcomemessage.pmadd.replace(/{{{user}}}/gi, `${member.user} (${member.displayName})`);
				pmmessage = pmmessage.replace(/{{{emoji}}}/gi, `${reaction.emoji.toString()}`);
				pmmessage = pmmessage.replace(/{{{role}}}/gi, `${role.name}`);
				pmmessage = pmmessage.replace(/{{{servername}}}/gi, `${reaction.message.guild.name}`);
				user.send(pmmessage);
			});
		}
		//{{{rolepairs}}} replace?
	} else if (reaction.message.id == bot.guildSettings[guild.id].rolemessage.messageid){
		let roleEmojis = bot.guildSettings[guild.id].rolemessage.roles.map(function(x) {
			return x[0];
		});
		if(roleEmojis.includes(emoji)){
			let roleid = bot.guildSettings[guild.id].rolemessage.roles.filter(function(x) {
				return x[0] == emoji;
			}).map(function(x) {
				return x[1];
			});
			role = await guild.roles.cache.find(r => r.id == roleid);
			member.roles.add(role);
			let pmmessage = bot.guildSettings[guild.id].rolemessage.pmadd.replace(/{{{user}}}/gi, `${member.user} (${member.displayName})`);
	    	pmmessage = pmmessage.replace(/{{{emoji}}}/gi, `${reaction.emoji.toString()}`);
	    	pmmessage = pmmessage.replace(/{{{role}}}/gi, `${role.name}`);
	    	pmmessage = pmmessage.replace(/{{{servername}}}/gi, `${reaction.message.guild.name}`);
	    	user.send(pmmessage);
		}
	}
});

bot.on('messageReactionRemove', async (reaction, user) => {
	console.log("messageReactionRemove reached");
	if(user.bot)return;
	const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
	const guild = reaction.message.guild;
	const member = await guild.members.cache.get(user.id);
	let role;
	let message;
	if (reaction.message.id == bot.guildSettings[guild.id].welcomemessage.messageid) {
	    if (bot.guildSettings[guild.id].welcomemessage.anyemoji || bot.guildSettings[guild.id].welcomemessage.emojis.includes(emoji)) {
	    	bot.guildSettings[guild.id].welcomemessage.roles.forEach(async r => {
	    		role = await guild.roles.cache.get(r);
	    		member.roles.remove(role);
	    		let pmmessage = bot.guildSettings[guild.id].welcomemessage.pmremove.replace(/{{{user}}}/gi, `${member.user} (${member.displayName})`);
		    	pmmessage = pmmessage.replace(/{{{emoji}}}/gi, `${reaction.emoji.toString()}`);
		    	pmmessage = pmmessage.replace(/{{{role}}}/gi, `${role.name}`);
		    	pmmessage = pmmessage.replace(/{{{servername}}}/gi, `${reaction.message.guild.name}`);
		    	user.send(pmmessage);
	    	});
	    }
	} else if (reaction.message.id == bot.guildSettings[guild.id].rolemessage.messageid){
		let roleEmojis = bot.guildSettings[guild.id].rolemessage.roles.map(function(x) {
	        return x[0];
	    });
		if(roleEmojis.includes(emoji)){
			let roleid = bot.guildSettings[guild.id].rolemessage.roles.filter(function(x) {
				return x[0] == emoji;
			}).map(function(x) {
				return x[1];
			});
			role = await guild.roles.cache.find(r => r.id == roleid);
			member.roles.remove(role);
			let pmmessage = bot.guildSettings[guild.id].rolemessage.pmremove.replace(/{{{user}}}/gi, `${member.user} (${member.displayName})`);
	    	pmmessage = pmmessage.replace(/{{{emoji}}}/gi, `${reaction.emoji.toString()}`);
	    	pmmessage = pmmessage.replace(/{{{role}}}/gi, `${role.name}`);
	    	pmmessage = pmmessage.replace(/{{{servername}}}/gi, `${reaction.message.guild.name}`);
	    	user.send(pmmessage);
		}
	}
});

process.on('unhandledRejection', error => {
	console.error(`Uncaught Promise Error: \n${error.stack}`);
});

//Errors, warnings and debug to console.
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

//Functions to check if the given value exists within an array.
function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

function getUniqueArray(arr=[], compareProps=[]) {
	let modifiedArray= [];
	if(compareProps.length === 0 && arr.length > 0) compareProps.push(...Object.keys(arr[0]));
	arr.map(item=> {
		if(modifiedArray.length === 0){
			modifiedArray.push(item);
		} else {
			if(!modifiedArray.some(item2=> compareProps.every(eachProps=> item2[eachProps] === item[eachProps]))){
				modifiedArray.push(item);
			}
		}
	 });
	 return modifiedArray;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Export client.
module.exports.bot = {
	bot: bot
};
