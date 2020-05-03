const Discord = module.require("discord.js");
const nodefetch = require("node-fetch");
const urbanapi = "http://api.urbandictionary.com/v0/define?term=";

module.exports.run = async (bot, message, args) => {
	let searchterm = args.join(" ");

	fetch(urbanapi + searchterm).then(res => res.json()).then(r => {
		if(!r.list[0]) return message.reply("Nothing came up with that search in the urban dictionary.");
		let urbanEmbed = new Discord.RichEmbed()
			.setTitle(`${searchterm}`)
			.setColor("#1aff1a")
			.addField("Defenition 1:", `${r.list[0].definition}\nExmaple: ${r.list[0].example}`)
			.addField("Defenition 2:", `${r.list[1].definition}\nExmaple: ${r.list[1].example}`)
			.addField("Defenition 3:", `${r.list[2].definition}\nExmaple: ${r.list[2].example}`);

			message.reply(urbanEmbed);
	});
}

module.exports.help = {
	name: "urban",
	type: "static",
	desc: "Pulls information about the given search words from urban dictionary.",
	example: "!urban [words here to search]"
}