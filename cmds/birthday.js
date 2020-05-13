module.exports.run = async (bot, message, args) => {
	let mentioned = (message.mentions.users.first() == null) ? message.author : message.mentions.users.first()
	let dateinfo = Date.parse(args[0]);
	if(Number.isNaN(dateinfo)) return message.reply("Please enter a date in the correct format:\n```!birthday [YYYY-MM-DD] *[@mention]* - optional```").then(m => m.delete({timeout:14000}).catch(e => console.error(e)));

	bot.birthdays[mentioned.id] = {
		originguildid: message.guild.id,
		date: dateinfo,
		announcedcurrentyear: false
	}
	let reply = (message.mentions.users.first() == null) ? `your` : `${message.mentions.users.first()}'s'`
	message.reply(`You have set ${reply} birthday date as ${args[0]}.`).then(m => m.delete({timeout:10000}).catch(e => console.error(e)));
}

module.exports.help = {
	name: "birthday",
	type: "static",
	desc: "Sets a birthday for a user, or for yourself.",
	example: "!birthday [YYYY-MM-DD] *or* !birthday [YYYY-MM-DD] [@mention]"
}
