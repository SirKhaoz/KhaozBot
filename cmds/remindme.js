module.exports.run = async (bot, message, args) => {
	let toRemind = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[args.length-1]);
	let time;
	if(toRemind){
		if(!args[1] || /[^\d]/.test(args[1] ) || args[1]  > 1440 || args[1]  < 0.5) {
			let msg = await message.reply("Please enter a valid number of mins between 1-1440 (1440 being 24 hours).");
			msg.delete({timeout:7000});
			return;
		}
		args.shift();
		time = args.shift();
	}else{
		if(!args[0] || /[^\d]/.test(args[0]) || args[0] > 1440 || args[0] < 0.5) {
			let msg = await message.reply("Please enter a valid number of mins between 1-1440 (1440 being 24 hours).");
			msg.delete({timeout:7000});
			return;
		}
		toRemind = message.guild.members.get(message.author.id);
		time = args.shift();
	}

	let remindermessage = args.join(" ");
	if(!remindermessage || remindermessage == '') remindermessage = "No reminder message given.";

	bot.reminders[toRemind.user.id] = {
		guild: message.guild.id,
		channel: message.channel.id,
		time: Date.now() + parseInt(time) * 60 * 1000,
		reminder: remindermessage
	}

	time = new Date(bot.reminders[toRemind.user.id].time).toLocaleString()
	if(toRemind.user.id == message.author.id) toRemind = "yourself.";
	let msg = await message.reply(`Set a reminder "*${remindermessage}*" for ${time}. The reminder will be in this channel.\nThis reminder is for ${toRemind}`);
	msg.delete({timeout:30000});
}

module.exports.help = {
	name: "remindme",
	altname: "remind",
	type: "static",
	desc: "Sets a reminder with a specified amount of minutes. Optional @mention to assign it to someone, and optional message.",
	example: "!remindme [@mention] [#time in mins] [message] *or* !remindme [#time in mins] [message]"
}
