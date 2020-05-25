module.exports.run = async (bot, message, args) => {
	let dateinfo = Date.parse(args[0]);
	if(Number.isNaN(dateinfo)) return message.reply("Please enter a date in the correct format:\n```!birthday [YYYY-MM-DD] *[@mention]* - optional```").then(m => m.delete({timeout:14000}).catch(e => console.error(e)));

	bot.birthdays[message.author.id] = {
		originguildid: message.guild.id,
		date: dateinfo,
		announcedcurrentyear: false
	}
	message.reply(`You have set your birthday date as ${args[0]}.\nI look forward to celebrating!`).then(m => m.delete({timeout:10000}).catch(e => console.error(e)));
}

module.exports.help = {
	name: "birthday",
	type: "static",
	desc: "Sets a birthday for a user, or for yourself.",
	example: "!birthday [YYYY-MM-DD] *or* !birthday [YYYY-MM-DD] [@mention]"
}
