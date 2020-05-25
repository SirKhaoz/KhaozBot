module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(!message.member.permissions.has("BAN_MEMBERS") && message.member.id != "78306944179245056"){
		let msg = await message.reply("You do not have permission to ban people.");
		msg.delete({timeout:7000});
		return;
	}

	//Get the mentioned user, either mention or full ID
	let toBan = message.guild.member(message.mentions.users.first());
	if(!toBan) return message.reply("You did not specify a user mention to ban.");

	//Prevent muting of bot
	if(toBan.user.bot) return message.reply("You can not ban a Bot via this command.");
	//Prevent muting of admin
	if(toBan.permissions.has("ADMINISTRATOR")) return message.reply("You can not ban an admin via this command.");
	//Prevent self-muting
	if(toBan.id === message.author.id) return message.reply("Why are you trying to ban yourself?");
	//Prevenet muting of higher or equal role
	if(toBan.roles.highest.position >= message.member.roles.highest.position && message.member.id != "78306944179245056") return message.reply("You can not ban someone with a higher or equal role as yourself.");

	let banReason = args.join(" ").slice(22);
	if (banReason == "") banReason = "No Reason Specified."

	try{
		message.guild.member(toBan).ban({reason:`${message.author} banned with reason: ${banReason}`});
	} catch (e) {
		message.reply(`ERROR, CONSOLE.\n<@78306944179245056>, check this out bro.`);
		console.log(e);
	}
}

module.exports.help = {
	name: "ban",
	type: "static",
	desc: "List's the current Bans on the server, bans or unbans a user.",
	example: "!ban [@user] [reason] *or* !ban list"
}
