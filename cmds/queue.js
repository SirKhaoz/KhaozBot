module.exports.run = async (bot, message, args) => {
	var message2 = "Current queue:\n```";
	var replyRepeat = "";

	if(bot.guildSettings[message.guild.id].repeat) replyRepeat = "on";
	if(!bot.guildSettings[message.guild.id].repeat) replyRepeat = "off";

	var repeatStatus = `\nRepeat is: *${replyRepeat}*.`;

	if(bot.guildSettings[message.guild.id].queue.length == 0){
		let msg = await message.reply("No songs playing, or in queue.");
		msg.delete({timeout:7000});
		return;
	}

	if(args[0] == "clear"){
		if(args[1] && (/[^\d]/.test(args[1]) || args[1] > bot.guildSettings[message.guild.id].queue.length || args[1] < 2)){
			let msg = await message.reply(`Please enter a valid number between 2-${bot.guildSettings[message.guild.id].queue.length}`);
			msg.delete({timeout:7000});
			return;
		}else if(!args[1]){
			bot.guildSettings[message.guild.id].queue.length = 1;
			return message.reply("Queue Cleared");
		}
		else{
			message.reply(`Removed: ${args[1]}: ${bot.guildSettings[message.guild.id].queue[args[1]-1]}`);
			bot.guildSettings[message.guild.id].queue.splice(args[1]-1,1);
		}
	}
	else if (args[0] == "shuffle"){
		shuffleArray(bot.guildSettings[message.guild.id].queue);
	}

	for(i = 0; i < bot.guildSettings[message.guild.id].queue.length; i++){
		var tempMessage = (i + 1) + ": " + bot.guildSettings[message.guild.id].queue[i].name + (i === 0 ? " **(Current Song)**" : "") + "\n";
		if((message2 + tempMessage + repeatStatus).length <= (2000 - 5)) {
			message2 += tempMessage;
		}
		else {
			message2 += "```";
			message2 += repeatStatus;
			message.channel.send(message2);
			message2 = "```";
		}
	}
	message2 += "```";
	message2 += repeatStatus;
	message.channel.send(message2);
}

module.exports.help = {
	name: "queue",
	altname: "q",
	type: "music",
	desc: "Displays current songs in queue, and their order.",
	example: "!queue *or* !queue clear *or !queue clear [number in queue to remove] *or* !queue shuffle *or* !q instead of !queue"
}

function shuffleArray(array) {
	var currentsong = array[0];
	array.shift();

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	array.unshift(currentsong);

	return array;

};
