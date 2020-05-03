const Discord = module.require("discord.js");
const nodefetch = require("node-fetch");
const rsapi = require('runescape-api');

module.exports.run = async (bot, message, args) => {
	//Quick check to see if user has not given a name.
	if(!args[0]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.channel.send("Please enter an OSRS name to search.");
		msg.delete(7000);
		return;
	}

	args[0] = args.join("_")

	rsapi.osrs.hiscores.player(args[0]).then(r => {
		let skills = r.skills, activities = r.activities;

	    var levelNames = Object.keys(skills).map(objKey => {
		    return objKey.charAt(0).toUpperCase() + objKey.slice(1); 
		});
		var levels = Object.keys(skills).map(objKey => {
		    return skills[objKey].level;  
		});
		var levelexp = Object.keys(skills).map(objKey => {
		    return skills[objKey].exp;  
		});
		var levelrank = Object.keys(skills).map(objKey => {
		    return skills[objKey].rank;  
		});

	    let embed = new Discord.RichEmbed()
			.setAuthor(`Current Stats For ${args[0].charAt(0).toUpperCase() + args[0].slice(1)}`)
			.setDescription(`Levels For Skills:`)
			.setColor("#1874CD")
			.setFooter("Brought to you proudly by " + `KhaozBot`)
			.setTimestamp();

		for(i = 0; i < levelNames.length; i++){
			embed.addField(levelNames[i], `Level:  ${levels[i]}\nEXP:    ${levelexp[i].toLocaleString()}`, true);
		}

		message.channel.send({embed :embed});

	}).catch(async e => {
		let msg = await message.reply("User not found.");
		msg.delete(7000);
		return;
	});

}

module.exports.help = {
	name: "osrshs",
	type: "static",
	desc: "Gets the highscores of the specified user",
	example: "!osrshs [user_name]"
}