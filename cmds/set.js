const emojiRegexMod = require('emoji-regex');
const emojiregex = emojiRegexMod();
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(!message.member.permissions.has("ADMINISTRATOR") && message.member.id != "78306944179245056") {
		let msg = await message.reply("You do not have permission to do this.");
		msg.delete({timeout: 7000}).catch(err => console.log(err));
		return;
	}

	if(!args[0]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.reply("Please enter a setting to change.");
		msg.delete({timeout: 7000});
		return;
	}

	argsLC = args.map(w => w.toLowerCase());

	if(argsLC[0] == "defaultchannel"){
		bot.guildSettings[message.guild.id].defaultchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the default channel, for this server.`);
	}
	else if(argsLC[0] == "joinchannel"){
		bot.guildSettings[message.guild.id].joinmessage.channel = message.channel.id;
		message.reply(`I have set ${message.channel} as the join message channel, for this server.`);
	}
	else if(argsLC[0] == "sendjoinmessages"){
		bot.guildSettings[message.guild.id].joinmessage.send = !bot.guildSettings[message.guild.id].joinmessage.send;
		message.reply(`I have set sending user-join messages to: ${bot.guildSettings[message.guild.id].joinmessage.send}.`);
	}
	else if(argsLC[0] == "leavechannel"){
		bot.guildSettings[message.guild.id].leavemessage.channel = message.channel.id;
		message.reply(`I have set ${message.channel} as the leave message channel, for this server.`);
	}
	else if(argsLC[0] == "sendleavemessages"){
		bot.guildSettings[message.guild.id].leavemessage.send = !bot.guildSettings[message.guild.id].leavemessage.send;
		message.reply(`I have set sending user-leave messages to: ${bot.guildSettings[message.guild.id].leavemessage.send}.`);
	}
	else if(argsLC[0] == "twitchchannel"){
		bot.guildSettings[message.guild.id].twitchchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the watched channel for twitch notifications, for this server.`);
	}
	else if(argsLC[0] == "leaguechannel"){
		bot.guildSettings[message.guild.id].leaguechannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the watched channel for league live-game notifications, for this server.`);
	}
	else if(argsLC[0] == "inthebinchannel"){
		if(!argsLC[1]){
			let msg = await message.reply("Please specifiy a channel to set as the 'inthebin' channel.");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
		let channel = message.guild.channels.cache.filter(c => c.type === 'voice' && c.name.toLowerCase().includes(argsLC[1].toLowerCase())).first();
		if(channel){
			message.reply(`I have set channel ${channel} as the 'inthebin' channel, for this server.`);
			bot.guildSettings[message.guild.id].touretteschannel = channel.id;
		}
		else{
			let msg = await message.reply("Cant find the specified channel. Please type the name of the voice channel eg. !inthebin [voicechannelname]");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
	}
	else if(argsLC[0] == "afkchannel"){
		if(!argsLC[1]){
			let msg = await message.reply("Please specifiy a channel to set as the afk channel.");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
		let channel = message.guild.channels.cache.filter(c => c.type === 'voice' && c.name.toLowerCase().includes(argsLC[1].toLowerCase())).first();
		if(channel){
			message.reply(`I have set channel ${channel} as the afk channel, for this server.`);
			bot.guildSettings[message.guild.id].afkchannel = channel.id;
		}
		else{
			let msg = await message.reply("Cant find the specified channel");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
	}
	else if(argsLC[0] == "botchannel"){
		bot.guildSettings[message.guild.id].botchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as bot commands channel, for this server.`);
	}
	else if(argsLC[0] == "musicchannel"){
		bot.guildSettings[message.guild.id].musicchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the music channel, for this server.`);
	}
	else if(argsLC[0] == "adminchannel"){
		bot.guildSettings[message.guild.id].adminchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the admin/events channel, for this server.`);
	}
	else if(argsLC[0] == "birthdaychannel"){
		bot.guildSettings[message.guild.id].birthdaychannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the birthday announce channel, for this server.`);
	}
	else if(argsLC[0] == "leaguechannel"){
		bot.guildSettings[message.guild.id].bdochannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the league channel, for this server.`);
	}
	else if(argsLC[0] == "bdochannel"){
		bot.guildSettings[message.guild.id].bdochannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the bdo commands and news channel, for this server.`);
	}
	else if(argsLC[0] == "bdobossping"){
		bot.guildSettings[message.guild.id].bdobossping.sendpings = !bot.guildSettings[message.guild.id].bdobossping.sendpings;
		message.reply(`I have set sending BDO boss warning pings to: ${bot.guildSettings[message.guild.id].bdobossping.sendpings}.`);
	}
	else if(argsLC[0] == "bdobosstimerchannel"){
		bot.guildSettings[message.guild.id].bdobossping.bosstimerchannel = message.channel.id;
		message.reply(`I have set ${message.channel} as the auto updating BDO boss timer channel, for this server.`);
	}
	else if(argsLC[0] == "bdosendschedule"){
		bot.guildSettings[message.guild.id].bdobossping.sendschedule = !bot.guildSettings[message.guild.id].bdobossping.sendschedule;
		message.reply(`I have set sending the BDO boss schedule to: ${bot.guildSettings[message.guild.id].bdobossping.sendschedule}.`);
	}
	else if(argsLC[0] == "bdobosspingrole"){
		let role = message.mentions.roles.first() || message.guild.roles.cache.get(argsLC[1]);
		if(!role){
			let msg = await message.reply("Could not find the role. Please mention or paste the **role ID** as the final argument.");
			msg.delete({timeout: 7000});
			return;
		}
		let index = indexOfObjectByName(bot.guildSettings[message.guild.id].bdobossping.roles, role.id);
		if(index != -1){
        	bot.guildSettings[message.guild.id].bdobossping.roles.splice(index, 1);
            message.reply(`I have removed this role ("${role.name} ID[${role.id}]") from the BDO boss ping list.`);
        }else{
        	bot.guildSettings[message.guild.id].bdobossping.roles.push(role.id);
            message.reply(`I have added this role ("${role.name} ID[${role.id}]") to the BDO boss ping list.`);
        }
	}
	else if(argsLC[0] == "movecommands"){
		bot.guildSettings[message.guild.id].movecommands = !bot.guildSettings[message.guild.id].movecommands;
		message.reply(`I have set the movement of commands to their respective channel to: ${bot.guildSettings[message.guild.id].movecommands}.`);
	}
	else if(argsLC[0] == "autopurge"){
		bot.guildSettings[message.guild.id].autopurge = !bot.guildSettings[message.guild.id].autopurge;
		message.reply(`I have set the automatic deletion of messages after 14 days to: ${bot.guildSettings[message.guild.id].autopurge}.`);
	}
	else if(argsLC[0] == "autopurgechannel"){
        let index = indexOfObjectByName(bot.guildSettings[message.guild.id].autopurgechannels, message.channel.id);
        if(index != -1){
        	bot.guildSettings[message.guild.id].autopurgechannels.splice(index, 1);
            message.reply(`I have removed this channel from the autopurge exemption list.`);
        }else{
        	bot.guildSettings[message.guild.id].autopurgechannels.push(message.channel.id);
            message.reply(`I have added this channel to the autopurge exemption list.`);
        }
	}
	else if(argsLC[0] == "joinmessage"){
		let joinmessage = args.slice(1);
		joinmessage = joinmessage.join(" ");
		bot.guildSettings[message.guild.id].joinmessage.message = joinmessage;
		message.reply(`I have set the user join message to:\n${bot.guildSettings[message.guild.id].joinmessage.message}`)
	}
	else if(argsLC[0] == "leavemessage"){
		let leavemessage = args.slice(1);
		leavemessage = leavemessage.join(" ");
		bot.guildSettings[message.guild.id].leavemessage.message = leavemessage;
		message.reply(`I have set the user leave message to:\n${bot.guildSettings[message.guild.id].leavemessage.message}`)
	}
	else if(argsLC[0] == "setupmessage"){
		if(argsLC[1] == "welcome"){
			if(argsLC[2] == "message"){
				let welcomemessage = args.slice(3);
				welcomemessage = welcomemessage.join(" ");
				bot.guildSettings[message.guild.id].welcomemessage.messagebody = welcomemessage;
				message.reply(`I have set the welcome channel message to:\n\n\n${bot.guildSettings[message.guild.id].welcomemessage.messagebody}`)
			} else if(argsLC[2] == "pmadd"){
				let pmadd = args.slice(3);
				pmadd = pmadd.join(" ");
				bot.guildSettings[message.guild.id].welcomemessage.pmadd = pmadd;
				message.reply(`I have set the welcome channel add-PM to:\n\n\n${bot.guildSettings[message.guild.id].welcomemessage.pmadd}`)
			} else if(argsLC[2] == "pmremove"){
				let pmremove = args.slice(3);
				pmremove = pmremove.join(" ");
				bot.guildSettings[message.guild.id].welcomemessage.pmremove = pmremove;
				message.reply(`I have set the welcome channel remove-PM to:\n\n\n${bot.guildSettings[message.guild.id].welcomemessage.pmremove}`)
			} else if(argsLC[2] == "anyemoji"){
				bot.guildSettings[message.guild.id].welcomemessage.anyemoji = !bot.guildSettings[message.guild.id].welcomemessage.anyemoji;
			} else if(argsLC[2] == "emoji"){
				let emoji = emojiextract(argsLC.slice(3).join(" "));
				if(emoji){
					let index = indexOfObjectByName(bot.guildSettings[message.guild.id].welcomemessage.emojis, emoji);
					if(index != -1){
			        	bot.guildSettings[message.guild.id].welcomemessage.emojis.splice(index, 1);
			            message.reply(`I have removed this emoji ("${emoji}") from the welcome list.`);
			        }else{
			        	bot.guildSettings[message.guild.id].welcomemessage.emojis.push(emoji);
			            message.reply(`I have added this emoji ("${emoji}") to the welcome list.`);
			        }
			    }
			    else{
			    	let msg = await message.reply("Not a valid emoji: '" + argsLC.slice(3).join(" ") +"'");
					msg.delete({timeout: 7000});
					return;
			    }
			} else if(argsLC[2] == "role"){
				let role = message.mentions.roles.first() || message.guild.roles.cache.get(argsLC[3]);
				if(!role){
					let msg = await message.reply("Could not find the role. Please mention or paste the **role ID** as the final argument.");
					msg.delete({timeout: 7000});
					return;
				}
				let index = indexOfObjectByName(bot.guildSettings[message.guild.id].welcomemessage.roles, role.id);
				if(index != -1){
		        	bot.guildSettings[message.guild.id].welcomemessage.roles.splice(index, 1);
		            message.reply(`I have removed this role ("${role.name} ID[${role.id}]") from the welcome list.`);
		        }else{
		        	bot.guildSettings[message.guild.id].welcomemessage.roles.push(role.id);
		            message.reply(`I have added this role ("${role.name} ID[${role.id}]") to the welcome list.`);
		        }
			} else{
				let msg = await message.reply("Please choose [message/pm/anyemoji/emoji/role] (as an additional argument).");
				msg.delete({timeout: 7000});
				return;
			}
		} else if(argsLC[1] == "role"){
			if(argsLC[2] == "message"){
				let rolemessage = args.slice(3);
				rolemessage = rolemessage.join(" ");
				bot.guildSettings[message.guild.id].rolemessage.messagebody = rolemessage;
				message.reply(`I have set the role-assign channel message to:\n\n\n${bot.guildSettings[message.guild.id].rolemessage.messagebody}`)
			} else if(argsLC[2] == "pmadd"){
				let pmadd = args.slice(3);
				pmadd = pmadd.join(" ");
				bot.guildSettings[message.guild.id].rolemessage.pmadd = pmadd;
				message.reply(`I have set the role-assign channel add-PM to:\n\n\n${bot.guildSettings[message.guild.id].rolemessage.pmadd}`)
			} else if(argsLC[2] == "pmremove"){
				let pmremove = args.slice(3);
				pmremove = pmremove.join(" ");
				bot.guildSettings[message.guild.id].rolemessage.pmremove = pmremove;
				message.reply(`I have set the role-assign channel remove-PM to:\n\n\n${bot.guildSettings[message.guild.id].rolemessage.pmremove}`)
			}else if(argsLC[2] == "role"){
				let emoji = emojiextract(argsLC.slice(3).join(" "));
				let roleID = argsLC.slice(3).join(" ").match(/\d+/g);
				let role = message.mentions.roles.first() || message.guild.roles.cache.get(roleID[0]);
				if(!role){
					let msg = await message.reply("Could not find a role. Please mention or paste the **role ID** as the final argument.");
					msg.delete({timeout: 7000});
					return;
				}
				if(!emoji){
					let msg = await message.reply("Could not find an emoji. Please include a valid emoji in the final argument.");
					msg.delete({timeout: 7000});
					return;
				}
				let index = indexOfObjectByName(bot.guildSettings[message.guild.id].rolemessage.roles, [emoji, role.id]);
				if(index != -1){
		        	bot.guildSettings[message.guild.id].rolemessage.roles.splice(index, 1);
		            message.reply(`I have removed this emoji/role pair ("${emoji} & ${role.name} [${role.id}]") from the role-assign list.`);
		        }else{
		        	bot.guildSettings[message.guild.id].rolemessage.roles.push([emoji, role.id]);
		            message.reply(`I have added this emoji/role pair ("${emoji} & ${role.name} [${role.id}]") to the role-assign list.`);
		        }
			} else{
				let msg = await message.reply("Please choose [message/pmadd/pmremove/role] (as an additional argument).");
				msg.delete({timeout: 7000});
				return;
			}
		} else{
			let msg = await message.reply("Please choose either welcome or role with this command (as an additional argument).");
			msg.delete({timeout: 7000});
			return;
		}
	}
	else if(argsLC[0] == "help"){
		message.channel.send(`**!set help** - displays this list.\n\
**!set defaultchannel** - sets the default/general channel of the server, to send and recieve primary bot updates such as join/leave messages.\n\
**!set joinchannel** - sets the join message channel of the server, if you need to specifically split join/leave messages.\n\
**!set sendjoinmessages** - sets the sending of user-join messages to true/false.\n\
**!set leavechannel** - sets the leave message channel of the server, if you need to specifically split join/leave messages.\n\
**!set sendleavemessages** - sets the sending of user-leave messages to true/false.\n\
**!set twitchchannel** - sets the twitch channel of the server, to send updates and notifications for twitch streams to.\n\
**!set leaguechannel** - sets the league of legends channel of the server, to send updates and notifications for league and live games to.\n\
**!set inthebinchannel** - sets the 'in the bin' channel of the server, to lock the \'In The Bin\' role to only use.`);

		message.channel.send(`**!set botchannel** - sets the bot channel of the server, to move commands that user\'s enter, to this channel.\n\
**!set musicchannel** - sets the music channel of the server, to move commands that user\'s enter (music bot related), to this channel.\n\
**!set adminchannel** - sets the admin/events channel of the server, to display admin/event notifications, to this channel.\n\
**!set birthdaychannel** - sets the birthday announce channel of the server, to this channel.\n\
**!set leaguechannel** - sets the league channel of the server, to paste automatic game updates, news etc, to this channel.\n\
**!set bdochannel** - sets the BDO channel of the server, to post news, timers and BDO related commands, to this channel.\n\
**!set bdobossping** - sets the BDO boss pings to true/false.\n\
**!set bdobosstimerchannel** - sets the BDO boss timer channel where the boss/events and pings get sent.\n\
**!set bdosendschedule** - sets the sending & updating of the BDO event schedule to true/false.`)

		message.channel.send(`**!set bdobosspingrole** - adds or removes a role to be pinged for boss/event timers.\n\
**!set movecommands** - sets the move commands boolean true or false, whether or not the commands should be moved to the bot channel or not.\n\
**!set autopurge** - sets the automatic deletion of messages after 14 days to true or false.\n\
**!set autopurgechannel** - sets the specific channel to be exempt or not from autopurge. ie. for welcome channel.\n\
**!set joinmessage** - sets the welcome message for the server. Use {{{user}}} for the person joining/leaving.\n\
**!set leavemessage** - sets the leav message for the server. Use {{{user}}} for the person joining/leaving.\n\
**!set setupmessage** - command to setup join and role assign messages. Type the command without parameters for additional help.`);
	}
	else{
		let msg = await message.reply("Please enter a valid setting to change. Type !set help to see a list of settings.");
		msg.delete({timeout: 7000});
		return;
	}

}

function emojiextract(string){
	//let result = string.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)
	let result = string.match(emojiregex);
	if(result) result = result[0]
	if(!result) result = false;
	return result;
}

//Function to check if the given value exists within an array.
function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].toString().toLowerCase().trim() === value.toString().toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

module.exports.help = {
	name: "set",
	type: "static",
	desc: "Sets specific channel or setting to desired choice.",
	example: "!set [setting] [selection] *or* !set (ie. !set twitchchannel twitch-notifications)"
}
