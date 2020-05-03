module.exports.run = async (bot, message, args) => {
	if(!message.member.permissions.has("ADMINISTRATOR")) {
		let msg = await message.reply("You do not have permission to do this.");
		msg.delete(7000).catch(err => console.log(err));
		return;
	}

	if(!args[0]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.reply("Please enter a setting to clear.");
		msg.delete(7000);
		return;
	}

	let txtchannelIDs = message.guild.channels.cache.filter(c=>c.type === 'text').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c);
	let voicechannelIDs = message.guild.channels.cache.filter(c=>c.type === 'voice').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c);

	if(args[0] == "defaultchannel"){
		bot.guildSettings[message.guild.id].defaultchannel = txtchannelIDs[0];
		message.reply(`I have cleared the default channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "welcomechannel"){
		bot.guildSettings[message.guild.id].welcomechannel = txtchannelIDs[0];
		message.reply(`I have cleared the welcome channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "leavechannel"){
		bot.guildSettings[message.guild.id].leavechannel = txtchannelIDs[0];
		message.reply(`I have cleared the leave channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "twitchchannel"){
		bot.guildSettings[message.guild.id].twitchchannel = txtchannelIDs[0];
		message.reply(`I have cleared the twitch notification channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "leaguechannel"){
		bot.guildSettings[message.guild.id].leaguechannel = txtchannelIDs[0];
		message.reply(`I have cleared the watched channel for league live-game notifications, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "inthebinchannel"){
		if(voicechannelIDs[0] == null) {
			bot.guildSettings[message.guild.id].touretteschannel = null;
			return message.reply("There are no voice channels to default back to, please make one first");
		}
		bot.guildSettings[message.guild.id].touretteschannel = voicechannelIDs[0];
		message.reply(`I have cleared the 'inthebin' channel, for this server. It has defaulted back to: ${voicechannelIDs[0]}`);
	}
	else if(args[0] == "afkchannel"){
		if(voicechannelIDs[0] == null) {
			bot.guildSettings[message.guild.id].touretteschannel = null;
			return message.reply("There are no voice channels to default back to, please make one first");
		}
		bot.guildSettings[message.guild.id].afkchannel = voicechannelIDs[voicechannelIDs.length - 1];
		message.reply(`I have cleared the afk channel, for this server. It has defaulted back to: ${voicechannelIDs[voicechannelIDs.length - 1]}`);
	}
	else if(args[0] == "botchannel"){
		bot.guildSettings[message.guild.id].botchannel = txtchannelIDs[0];
		message.reply(`I have cleared the bot commands channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "musicchannel"){
		bot.guildSettings[message.guild.id].musicchannel = txtchannelIDs[0];
		message.reply(`I have cleared the music commands channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "adminchannel"){
		bot.guildSettings[message.guild.id].adminchannel = txtchannelIDs[0];
		message.reply(`I have cleared the admin commands channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "leaguechannel"){
		bot.guildSettings[message.guild.id].leaguechannel = txtchannelIDs[0];
		message.reply(`I have cleared the league channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "bdochannel"){
		bot.guildSettings[message.guild.id].bdochannel = txtchannelIDs[0];
		message.reply(`I have cleared the bdo channel, for this server. It has defaulted back to: ${txtchannelIDs[0]}`);
	}
	else if(args[0] == "movecommands"){
		bot.guildSettings[message.guild.id].movecommands = false;
		message.reply(`I have set the movement of bot commands to the bot channel to: ${bot.guildSettings[message.guild.id].movecommands}.`);
	}
	else if(args[0] == "welcomemessage"){
		bot.guildSettings[message.guild.id].welcomemessage = "Welcome to the server... {{{user}}}";
		message.reply(`I have set the welcome message back to the default of: ${bot.guildSettings[message.guild.id].welcomemessage}.`);
	}
	else if(args[0] == "leavemessage"){
		bot.guildSettings[message.guild.id].leavemessage = "Rip, cy@ nerd, {{{user}}} has left.";
		message.reply(`I have set the welcome message back to the default of: ${bot.guildSettings[message.guild.id].leavemessage}.`);
	}
	else if(args[0] == "setupmessage"){
		if(args[1] == "welcome"){
			if(args[2] == "message"){
				bot.guildSettings[message.guild.id].welcomemessage.messagebody = null;
				message.reply(`I have cleared the setupmessage welcome message. There is currently no message.`);
			} else if(args[2] == "pmadd"){
				bot.guildSettings[message.guild.id].welcomemessage.pmadd = "{{{emoji}}}  Welcome to {{{servername}}}!  {{{emoji}}}";
				message.reply(`I have cleared the setupmessage welcome pm. The pm-add-message has defaulted back to "{{{emoji}}}  Welcome to {{{servername}}}!  {{{emoji}}}".`);
			} else if(args[2] == "pmremove"){
				bot.guildSettings[message.guild.id].welcomemessage.pmremove = "{{{emoji}}} **You have removed yourself from {{{servername}}}.**  {{{emoji}}}";
				message.reply(`I have cleared the setupmessage welcome pm. The pm-remove-message has defaulted back to "{{{emoji}}} **You have removed yourself from {{{servername}}}.**  {{{emoji}}}".`);
			} else if(args[2] == "emoji"){
				bot.guildSettings[message.guild.id].welcomemessage.emojis = [];
				message.reply(`I have cleared the setupmessage welcome emojis. There are currently no emojis.`);
			} else if(args[2] == "role"){
				bot.guildSettings[message.guild.id].welcomemessage.roles = [];
				message.reply(`I have cleared the setupmessage welcome roles. There are currently no roles.`);
			} else if(args[2] == "currentmessage"){
				if(bot.guildSettings[message.guild.id].welcomemessage.messageid){
					let messagechannel = message.guild.channels.cache.find(c => c.id == bot.guildSettings[message.guild.id].welcomemessage.channelid);
					messagechannel.fetchMessage(bot.guildSettings[message.guild.id].welcomemessage.messageid).then(msg => msg.delete());
					bot.guildSettings[message.guild.id].welcomemessage.messageid = null;
					bot.guildSettings[message.guild.id].welcomemessage.channelid = null;
					message.reply(`I have cleared the setupmessage role-assign current message. There is now no message.`);
				} else {
					message.reply(`No message found to remove. There is no message.`);
				}
			} else{
				let msg = await message.reply("Please choose [message/pm/emoji/role/currentmessage] (as an additional argument).");
				msg.delete(7000);
				return;
			}
		} else if(args[1] == "role"){
			if(args[2] == "message"){
				bot.guildSettings[message.guild.id].rolemessage.messagebody = null;
				message.reply(`I have cleared the setupmessage role-assign message. There is currently no message.`);
			} else if(args[2] == "pmadd"){
				bot.guildSettings[message.guild.id].rolemessage.pmadd = null;
				message.reply(`I have cleared the setupmessage role-assign add-pm. There is currently no pm-message.`);
			} else if(args[2] == "pmremove"){
				bot.guildSettings[message.guild.id].rolemessage.pmremove = null;
				message.reply(`I have cleared the setupmessage role-assign remove-pm. There is currently no pm-message.`);
			} else if(args[2] == "role"){
				bot.guildSettings[message.guild.id].rolemessage.roles = [];
				message.reply(`I have cleared the setupmessage role-assign role-emoji combos. There are currently no role-emoji combos.`);
			} else if(args[2] == "currentmessage"){
				if(bot.guildSettings[message.guild.id].rolemessage.messageid){
					let messagechannel = message.guild.channels.cache.find(c => c.id == bot.guildSettings[message.guild.id].rolemessage.channelid);
					messagechannel.fetchMessage(bot.guildSettings[message.guild.id].rolemessage.messageid).then(msg => msg.delete());
					bot.guildSettings[message.guild.id].rolemessage.messageid = null;
					bot.guildSettings[message.guild.id].rolemessage.channelid = null;
					message.reply(`I have cleared the setupmessage role-assign current message. There is now no message.`);
				} else {
					message.reply(`No message found to remove. There is no message.`);
				}
			} else{
				let msg = await message.reply("Please choose [message/pm/role/currentmessage] (as an additional argument).");
				msg.delete(7000);
				return;
			}
		} else{
			let msg = await message.reply("Please choose either welcome or role with this command (as an additional argument).");
			msg.delete(7000);
			return;
		}
	}
	else{
		let msg = await message.channel.send("Please enter a valid setting to clear. Type '!set help' to see a list of settings.");
		msg.delete(7000);
		return;
	}

}

module.exports.help = {
	name: "clearsetting",
	type: "command",
	desc: "Clears specific channel or setting.",
	example: "!clearsetting [setting] (ie. !clear twitchchannel)"
}
