const Discord = module.require("discord.js");
const authusers = require("../resources/authorisedusers.json");
const botmisc = require("../resources/botmiscsettings.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(!message.member.permissions.has("ADMINISTRATOR")) {
		let msg = await message.reply("You do not have permission to do this. [requires: ADMINISTRATOR]");
		msg.delete({timeout: 7000}).catch(err => console.log(err));
		return;
	}

	if(args[0] == "welcome"){
		if(!bot.guildSettings[message.guild.id].welcomemessage.messagebody){
			let msg = await message.reply("You have not set a message for this. Use !set setupmessage welcome message [MESSAGE HERE].\nFormatting works such as emojis, * wrap for *italics* and ** wrap for **bold**.");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
		if(bot.guildSettings[message.guild.id].welcomemessage.emojis.length <= 0) {
			let msg = await message.reply("You have not set any emojis for the message reactions. Use !set setupmessage welcome emoji [EMOJI]");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
		if(bot.guildSettings[message.guild.id].welcomemessage.roles.length <= 0) {
			let msg = await message.reply("WARNING: You have not assigned a role. This is not needed, but if you'd like a role to be assigned after reaction use the command:\n!set setupmessage welcome role [@role *or* role id]");
			msg.delete({timeout: 14000}).catch(err => console.log(err));
		}
		message.channel.send(bot.guildSettings[message.guild.id].welcomemessage.messagebody).then(async function (msg){
			bot.guildSettings[message.guild.id].welcomemessage.emojis.forEach(async em => {
				await msg.react(em);
			});
			bot.guildSettings[message.guild.id].welcomemessage.messageid = msg.id;
			bot.guildSettings[message.guild.id].welcomemessage.channelid = msg.channel.id;
		}).catch(function(e) {
			message.channel.send("Error when setting up welcome message:\n" + e)
		});
	} else if(args[0] == "role"){
		if(!bot.guildSettings[message.guild.id].rolemessage.messagebody){
			let msg = await message.reply("You have not set a message for this. Use !set setupmessage role message [MESSAGE HERE].\nFormatting works such as emojis, * wrap for *italics* and ** wrap for **bold**.");
			msg.delete({timeout: 7000}).catch(err => console.log(err));
			return;
		}
		if(bot.guildSettings[message.guild.id].rolemessage.roles.length <= 0) {
			let msg = await message.reply("WARNING: You have not assigned any role-emoji pairs.\nThis is technicaally not needed, but if you'd like a role to be assigned after reaction use the command:\n!set setupmessage role role [*emoji* **and** (@role *or* role id)]");
			msg.delete({timeout: 14000}).catch(err => console.log(err));
		}
		if(bot.guildSettings[message.guild.id].rolemessage.messageid){
			let messagechannel = message.guild.channels.cache.find(c => c.id == bot.guildSettings[message.guild.id].rolemessage.channelid);
			messagechannel.messages.fetch(bot.guildSettings[message.guild.id].rolemessage.messageid).then(msg => {
				msg.edit(bot.guildSettings[message.guild.id].rolemessage.messagebody);
				bot.guildSettings[message.guild.id].rolemessage.roles.forEach(async em => {
					await msg.react(em[0]);
				});
			}).catch(function(e) {
				message.channel.send("Error occured:\n" + e)
			});
		} else {
			message.channel.send(bot.guildSettings[message.guild.id].rolemessage.messagebody).then(async function (msg){
				bot.guildSettings[message.guild.id].rolemessage.roles.forEach(async em => {
					await msg.react(em[0]);
				});
				bot.guildSettings[message.guild.id].rolemessage.messageid = msg.id;
				bot.guildSettings[message.guild.id].rolemessage.channelid = msg.channel.id;
			}).catch(function(e) {
				message.channel.send("Error when setting up role message:\n" + e)
			});
		}
	} else {
		let msg = await message.reply("Please correctly define either 'welcome' or 'role' as your second parameter");
		msg.delete({timeout: 7000}).catch(err => console.log(err));
		return;
	}
	
	console.log(`SETUP ${args[0]} MESSAGE WAS RUN ON: ${message.member.guild.name} BY: ${message.member.user.username}#${message.member.user.discriminator}`);
}

module.exports.help = {
	name: "setupmessage",
	type: "static",
	desc: "Sets up the message for either welcome or role assignment.",
	example: "!setupmessage [role/welcome]"
}