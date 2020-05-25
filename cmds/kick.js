module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(!message.member.permissions.has("KICK_MEMBERS") && message.member.id != "78306944179245056"){
		let msg = await message.reply("You do not have permission to !kick people.");
		msg.delete({timeout:7000});
		return;
	}

	//Get the mentioned user, either mention or full ID
	let toKick = message.guild.member(message.mentions.users.first());
	if(!toKick) return message.reply("You did not specify a user mention to kick.");

	//Prevent kicking of admin
	if(toKick.permissions.has("ADMINISTRATOR") && message.member.id != "78306944179245056") return message.reply("You can not kick an admin via the !kick command.");
	//Prevent self-kicking
	if(toKick.id === message.author.id) return message.reply("Why are you trying to kick yourself?");
	//Prevenet muting of higher or equal role
	if(toKick.roles.highest.position >= message.member.roles.highest.position && message.member.id != "78306944179245056") return message.reply("You can not !kick someone with a higher or equal role as yourself.");

	let kickReason = args.join(" ").slice(22); //limit size of reason.
	if (kickReason == "") kickReason = "No Reason Specified."

	try{
		message.guild.member(toKick).kick(`${message.author} kicked with reason: ${kickReason}`);
	} catch (e) {
		message.reply(`ERROR, CONSOLE.\n<@78306944179245056>, check this out bro.`);
		console.log(e);
	}
}

module.exports.help = {
	name: "kick",
	type: "static",
	desc: "Kick's a user from the server.",
	example: "!kick [@user] [reason]"
}
