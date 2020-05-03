module.exports.run = async (bot, message, args) => {
	//Get the mentioned user, either mention or full ID
	let toStrip = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	//If no specified @ user mention
	if(!toStrip) {
		let msg = await message.reply("You did not specify a user @mention to strip.");
		msg.delete(7000).catch(err => console.log(err));
		return;
	}

	if(bot.guildSettings[message.guild.id].welcomemessage.messageid){
		let channel = message.guild.channels.cache.find(c => c.id == bot.guildSettings[message.guild.id].welcomemessage.channelid);
		channel.fetchMessage(bot.guildSettings[message.guild.id].welcomemessage.messageid).then(msg => {
	    	msg.reactions.forEach(async r => {
		    	r.remove(toStrip.id);
	    	});
	    	toStrip.user.send(`Your roles have been stripped. You will need to re-react the next time you join.`);
		}).catch(e => console.log(e)).finally(console.log("No welcome message?"));
	}
	if(bot.guildSettings[message.guild.id].rolemessage.messageid){
		let channel = message.guild.channels.cache.find(c => c.id == bot.guildSettings[message.guild.id].rolemessage.channelid);
		channel.fetchMessage(bot.guildSettings[message.guild.id].rolemessage.messageid).then(msg => {
	    	msg.reactions.forEach(async r => {
		    	r.remove(toStrip.id);
	    	});
	    	toStrip.user.send(`Your roles have been stripped. You will need to re-react the next time you join.`);
		}).catch(e => console.log(e)).finally(console.log("No welcome message?"));
	}
}

module.exports.help = {
	name: "strip",
	type: "static",
	desc: "Strips reactions from welcome message as a test.",
	example: "!strip [@member]"
}