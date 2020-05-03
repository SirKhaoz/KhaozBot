const authusers = require("../resources/authorisedusers.json");
const botmisc = require("../resources/botmiscsettings.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(!message.member.permissions.has("ADMINISTRATOR")) {
		let msg = await message.reply("You do not have permission to do this.");
		msg.delete(7000).catch(err => console.log(err));
		return;
	}

	//Get the mentioned user, either mention or full ID
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	//If no specified @ user mention
	if(!toMute) return message.reply("You did not specify a user @mention to command lock.");
	//Prevent muting of bot
	if(toMute.user.bot) return message.reply("You can not command lock a Bot...");
	//Prevent muting of admin
	if(toMute.permissions.has("ADMINISTRATOR")) return message.reply("You can not command lock an Admin...");
	//Prevent self-muting
	if(toMute.id === message.author.id) return message.reply("Why are you trying to command lock yourself?");
	//Prevenet muting of higher or equal role
	//if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You can not command lock someone with a higher or equal role as yourself.");


	let index = indexOfObjectByName(bot.guildSettings[message.guild.id].commandlocked, toMute.id);
	if(index != -1){
		bot.guildSettings[message.guild.id].commandlocked.splice(index, 1);
		message.reply(` I have removed the command lock on ${toMute}.`);
	} else {
		bot.guildSettings[message.guild.id].commandlocked.push(toMute.id);
		message.reply(` I have added a command lock on ${toMute}.`);
	}
	
}

function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

module.exports.help = {
	name: "commandlock",
	type: "command",
	desc: "Locks the use of commands for a specific user.",
	example: "!commandlock [@user]"
}