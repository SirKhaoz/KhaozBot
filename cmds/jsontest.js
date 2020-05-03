const Discord = module.require("discord.js");
const api = "https://jsonplaceholder.typicode.com/posts";
const nodefetch = require("node-fetch");

module.exports.run = async (bot, message, args) => {
	nodefetch.fetch(api).then(r => {
		let body = r.body;
		let id = Number(args[0]);
		if(!id) return message.channel.send("Supply an ID.");
		if(isNaN(id)) return message.channel.send("Supply a valid number.");
		
		let entry = body.find(post => post.id === id);
		if(!entry) return message.channel.send("Could not find entry.");
		console.log(entry);

		let embed = new Discord.RichEmbed()
			.setAuthor(entry.title)
			.setDescription(entry.body)
			.addField("Author ID", entry.userId)
			.setFooter("Post ID: " + entry.id);

		message.channel.send({embed :embed});


	});
}

module.exports.help = {
	name: "json",
	type: "command",
	desc: "Testing SnekFetch json api. https://jsonplaceholder.typicode.com/posts",
	example: "!json [id number of example on example site, listed above]"
}