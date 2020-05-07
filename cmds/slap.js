module.exports.run = async (bot, message, args) => {
	//Get the mentioned user, either mention or full ID
	let toSlap = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	//If no specified @ user mention
	if(!toSlap) {
		let msg = await message.reply("You did not specify a user @mention to slap.");
		msg.delete({timeout:7000}).catch(err => console.log(err));
		return;
	}

	if(toSlap.id === message.author.id) return message.reply(" congratulations. You've slapped yourself. Dumbass.");

	message.channel.send(`${message.author} *slaps the fuck outta* ${toSlap}, you've been a naughty boi.`);
	//TODO - add amount of times person has been slapped
	//TODO - add reaction after the slap
}

module.exports.help = {
	name: "slap",
	type: "static",
	desc: "Slaps a specific user.",
	example: "!slap [@user]"
}
