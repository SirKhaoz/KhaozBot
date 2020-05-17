const fs = require('fs');

module.exports.run = async (bot, message, args) => {
	args = args.map(w => w.toLowerCase());

	if(args[0] == "1"){
		message.channel.send(`**BDO AP/DP Bracket Information:**`, {files: [{
			attachment: `./resources/bdoinfo/apdpbrackets.png`,
			name: `BDO AP/DP Bracket Information.png`
		}]});
	} else if(args[0] == "2"){
		message.channel.send(`**Party Combat EXP Information:**`, {files: [{
			attachment: `./resources/bdoinfo/combatxpinfo.png`,
			name: `Party Combat EXP Information.png`
		}]});
	} else if (args[0] == "3") {
		message.channel.send(`**Bartali book adventure guides:**\n\
**Part 1-10:** <https://docs.google.com/document/d/1_36I1ah01yVhZ59jUDx45SnkdhNrnp3ey6DgDeqV5Vg/edit>\n\
**Part 11-15:** <https://docs.google.com/document/d/1sxN87MfNPDJEhtOg5qyfd5pcRi_yjheyiYLhanWCRFU/edit>`)
} else if(args[0] == "4"){
		message.channel.send(`**Information on basic alchemy ingredients/recipies:**\n\
http://dulfy.net/2016/05/08/black-desert-alchemy-life-skill-guide/\n\
https://incendar.com/bdoalchemyrecipes.php`, {files: [{
			attachment: `./resources/bdoinfo/alchbase.png`,
			name: `Basic Alchemy Ingredients.png`
		}]
	});
} else if (args[0] == "5") {
	message.channel.send(`**Useful BDO Knowledge-Locator Tool:**\n\
https://grumpygreen.cricket/old-site/bdo-knowledge-locator.html`)
} else if(args[0] == "6"){
	message.channel.send(`**Information on how to change your BDO font:**`, {files: [{
		attachment: `./resources/bdoinfo/fontchange.png`,
		name: `Font Change Information.png`
	}]});
} else if (args[0] == "7") {
		message.reply("Bro **str8 up**, get off my back, I'm working on this.")
	}  else {
		let msg = await message.reply(`Please enter a valid option (**type a number only, ie. \`!bdoinfo 1**\`). The options to chose from are:\n\
**Gear & Leveling:**\n\
1. Brackets\n\
2. Party combat EXP information\n\
**Crafting:**\n\
3. Bartalibooks\n\
4. Alchbase\n\
5. Knowledge\n\
**Misc:**\n\
6. Fonts\n\
7. TODO`);
		msg.delete({timeout:14000});
		return;
	}
}

module.exports.help = {
	name: "bdoinfo",
	type: "static",
	desc: "Displays information selected about BDO, ie. AP/DP bracket information etc",
	example: "!bdoinfo [selection]"
}
