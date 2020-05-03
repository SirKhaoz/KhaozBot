const Discord = module.require("discord.js");
const lolaccounts = require("../resources/lolaccounts.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	let joineduser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

	//If no specified @ user mention
	if(!joineduser) joineduser = message.guild.member(message.member);

	let joinedat = joineduser.joinedAt;

	message.channel.send(`${joineduser} joined this server on: ${joinedat}`);
}

module.exports.help = {
	name: "joined",
	type: "static",
	desc: "See when you, or a user, joined this server.",
	example: "!joined *or* !joined [@user]"
}