module.exports.run = async (bot, message, args) => {
	let matches, users, guild;
	let searchTerm = args[0];
	if(!searchTerm) return message.channel.send("Please enter a name to search.");

	if(args[1] == "admin" && bot.authusers[message.member.id].admin == 1){
		users = bot.users;
		matches = users.filter(u => u.tag.toLowerCase().includes(searchTerm.toLowerCase()));
	} else {
		guild = bot.guilds.cache.filter(g => g.id == message.guild.id).first();
		users = guild.members;
		matches = users.filter(u => u.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
	}

	if(matches.map(u => u.displayName) == "") return message.channel.send("No matches found.");
	message.channel.send(matches.map(u => `<@${u.id}>`));

}

module.exports.help = {
	name: "finduser",
	type: "static",
	desc: "Finds all users with the specified string in thier display name.",
	example: "!findusers [string]"
}