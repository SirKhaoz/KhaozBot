const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(!message.member.permissions.has("MUTE_MEMBERS")) return message.reply("You do not have permission to do this.");

	//Get the mentioned user, either mention or full ID
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

	//If no specified @ user mention
	if(!toMute) return message.reply("You did not specify a user mention to mute!");
	//Prevent muting of bot
	if(toMute.user.bot) return message.reply("You can not mute a Bot.");
	//Prevent muting of admin
	if(toMute.permissions.has("ADMINISTRATOR")) return message.reply("You can not mute an Admin.");
	//Prevent self-muting
	if(toMute.id === message.author.id) return message.reply("Why are you trying to mute yourself?");
	//Prevenet muting of higher or equal role
	if(toMute.highestRole.position >= message.member.highestRole.position) return message.reply("You can not mute someone with a higher or equal role as yourself.");

	//Attempt to find pre-exsisting role of "Muted"
	let role = message.guild.roles.cache.find(r => r.name === "Muted");
	//If no role, create role
	if(!role){
		try{
			role = await message.guild.createRole({
				name: "Muted",
				color: "#ff0000",
				permissions: []
			});

			message.guild.channels.cache.forEach(async (channel, id) => {
				await channel.overwritePermissions(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});

		}catch(e){
			console.log(e.stack);
		}

	}

	if(toMute.roles.has(role.id)) return message.reply("This user is already muted!");

	//Checking to see if additional args was a number
	if(args[1]) {
		if(isNaN(parseInt(args[1].trim()))) return message.reply("Please specify a correct amount of time, in seconds.");

		bot.mutes[toMute.id] = {
			guild: message.guild.id,
			time: Date.now() + parseInt(args[1]) * 1000
		}
	}
	else{
		bot.mutes[toMute.id] = {
			guild: message.guild.id,
			time: "null"
		}
	}

	await toMute.addRole(role);

	let adminChannel = message.guild.channels.cache.filter(c=>c.id == bot.guildSettings[message.guild.id].adminchannel).first();
	let muteEmbed = new Discord.RichEmbed()
		.setDescription("--- MUTED: ---")
		.setColor("#0099CC")
		.addField("Muted user:", `${toMute} (${toMute.displayName}) with ID of ${toMute.id}`)
		.addField("Muted by:", `${message.author}`)
		.addField("Time:", message.createdAt)
	adminChannel.send(muteEmbed);

	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if(err) throw err;
		message.reply(`I have muted ${toMute} for you.`);
	});
}

module.exports.help = {
	name: "mute",
	type: "ṣtatic",
	desc: "Mutes a user indefinatley, or for a specified time in seconds.",
	example: "!mute [@user] [time in seconds] *or* !mute [@user]"
}