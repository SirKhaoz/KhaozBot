module.exports.run = async (bot, message, args) => {
	if(bot.authusers[message.member.id].admin != 1) return message.reply(`I'm working on this at the moment. No touchy.`);

	let mentioned = (message.mentions.users.first() == null) ? message.author : message.mentions.users.first()
	let dateinfo = Date.parse(args[0]);
	if(Number.isNaN(dateinfo)) return message.reply("Please enter a date in the correct format:\n```!birthday [YYYY-MM-DD] [@mention]```").then(m => m.delete({timeout:7000}).catch(e => console.error(e)));

	bot.birthdays[mentioned.id] = {
		guild: message.guild.id,
		date: dateinfo
	}
}

module.exports.help = {
	name: "birthday",
	type: "static",
	desc: "Sets a birthday for a user",
	example: "!birthday"
}
