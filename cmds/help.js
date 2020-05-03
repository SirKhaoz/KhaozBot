const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	let commands = bot.commands.map(n => n.help.name);
	let helpinfo = bot.commands.map(n => n.help.desc);
	let exampleinfo = bot.commands.map(n => n.help.example);

	let embed = new Discord.MessageEmbed()
			.setTitle("**----------------------- ? Help ? -----------------------**")
			.setDescription(module.exports.help.desc)
			.setColor(0x00AE86)
	let embed2 = new Discord.MessageEmbed()
			.setColor(0x00AE86)

//re-write in forEach(...)
//re-write for dynamic max size (not 2 embeds)
	for(i = 0; i <= commands.length - 1; i++){
		commands[i] = commands[i].charAt(0).toUpperCase() + commands[i].slice(1);
		if(i<24){
			embed.addField(commands[i], (`${helpinfo[i]} \nUse: ${exampleinfo[i]}`))
		} else {
			embed2.addField(commands[i], (`${helpinfo[i]} \nUse: ${exampleinfo[i]}`))
		}
	};

	message.channel.send({embed: embed});
	message.channel.send({embed: embed2});
	return;
}

module.exports.help = {
	name: "help",
	type: "command",
	desc: "Shows general help for each command.",
	example: "!help"
}
