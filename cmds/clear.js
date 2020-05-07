module.exports.run = async (bot, message, args) => {
	if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You do not have permission to do this.");

	if(isNaN(parseInt(args[0]))){
		let msg = await message.reply("Please specify a number of messages to clear. (*!clear [# of messages]*)");
		msg.delete({timeout:7000});
		return;
	} else if(args[0] < 1 || args[0] > 99){
		let msg = await message.reply("Please specify a number of messages to clear between *1* and *99*.");
		msg.delete({timeout:7000});
		return;
	}
  message.channel.bulkDelete(parseInt(args[0]) + 1);
  let msg = await message.reply(`Cleared ${args[0]} messages.`);
	msg.delete({timeout:7000});
}

module.exports.help = {
	name: "clear",
	type: "static",
	desc: "Clear's a specified amount of messages from the current channel.",
	example: "!clear [# of messages] (must be between 1 and 100 inclusive)"
}
