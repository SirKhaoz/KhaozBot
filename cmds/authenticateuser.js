const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(bot.authusers[message.member.id].admin != 1) return message.reply("You do not have permission to do this.");

	let toauth = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toauth) return message.channel.send("You did not specify a user mention to auth!");

	if (!bot.authusers[toauth.id]){
		bot.authusers[toauth.id] = {
			username: toauth.user.username,
			admin: false,
			announce: false,
			activity: false
		}
	}

	if(args[1] == "admin"){
		bot.authusers[toauth.id].admin = !bot.authusers[toauth.id].admin;
		message.reply(` changed the admin permission of ${toauth.user.username} to: ${bot.authusers[toauth.id].admin}.`);
	}
	else if(args[1] == "announce"){
		bot.authusers[toauth.id].announce = !bot.authusers[toauth.id].announce;
		message.reply(` changed the announce permission of ${toauth.user.username} to: ${bot.authusers[toauth.id].announce}.`);
	}
	else if(args[1] == "accounts"){
		bot.authusers[toauth.id].accounts = !bot.authusers[toauth.id].accounts;
		message.reply(` changed the accounts editing permission of ${toauth.user.username} to: ${bot.authusers[toauth.id].accounts}.`);
	}
	else if(args[1] == "activity"){
		bot.authusers[toauth.id].activity = !bot.authusers[toauth.id].activity;
		message.reply(` changed the activity permission of ${toauth.user.username} to: ${bot.authusers[toauth.id].activity}.`);
	}
	else{
		return message.reply(` you did not specify a valid permission to authenticate.`);
	}

	await fs.writeFileSync("./resources/authorisedusers.json", JSON.stringify(bot.authusers, null, 1), err => {
		if(err) throw err;
		console.log(`I have written the new authusers to file.`);
	});	
}

module.exports.help = {
	name: "authenticateuser",
	type: "command",
	desc: "Adds/Removes a global bot auth user. Only special people are allowed to use this.",
	example: "!authenticateuser [@user] [roletype] *where role type is admin/announce/activity*"
}