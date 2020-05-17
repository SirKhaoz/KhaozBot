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
	} else if(args[0] == "3"){
		message.channel.send(`**Information on basic alchemy ingredients/recipies:**\n\
http://dulfy.net/2016/05/08/black-desert-alchemy-life-skill-guide/\n\
https://incendar.com/bdoalchemyrecipes.php`, {files: [{
			attachment: `./resources/bdoinfo/alchbase.png`,
			name: `Basic Alchemy Ingredients.png`
			}]
		});
	} else if (args[0] == "4") {
		message.channel.send(`**Bartali book adventure guides:**\n\
**Part 1-10:** <https://docs.google.com/document/d/1_36I1ah01yVhZ59jUDx45SnkdhNrnp3ey6DgDeqV5Vg/edit>\n\
**Part 11-15:** <https://docs.google.com/document/d/1sxN87MfNPDJEhtOg5qyfd5pcRi_yjheyiYLhanWCRFU/edit>`)
	} else if (args[0] == "5") {
		message.channel.send(`**Useful BDO Knowledge-Locator Tool:**\n\
		https://grumpygreen.cricket/old-site/bdo-knowledge-locator.html`)
	} else if(args[0] == "6"){
		message.channel.send(`**Party Combat EXP Information:**`, {files: [{
			attachment: `./resources/bdoinfo/combatxpinfo.png`,
			name: `Party Combat EXP Information.png`
		}]});
	} else if(args[0] == "7"){
		message.channel.send(`**Unlimited Potion Information:**`, {files: [{
			attachment: `./resources/bdoinfo/unlimitedpotionmats.png`,
			name: `Unlimited Potion Information.png`
		}]});
		message.channel.send(`**Unlimited Potion *EVENT* Information:**`, {files: [{
			attachment: `./resources/bdoinfo/unlimitedpotionmats-event.png`,
			name: `Unlimited Potion EVENT Information.png`
		}]});
	} else if (args[0] == "8") {
		message.reply("Bro **str8 up**, get off my back, I'm working on this.")
	}  else {
		let msg = await message.reply(`Please enter a valid option (**type a number only, ie.** \`!bdoinfo 1\`). The options to chose from are:\n\
**Gear & Leveling:**\n\
1. Brackets\n\
2. Party combat EXP information\n\
**Crafting:**\n\
3. Alchbase\n\
**Adventure Logs/Books:**\n\
4. Bartalibooks\n\
**Progression:**\n\
5. Knowledge\n\
6. Unlimited Potions\n\
**Misc:**\n\
7. Fonts\n\
8. TODO`);
		msg.delete({timeout:25000});
		return;
	}
}

module.exports.help = {
	name: "bdoinfo",
	type: "static",
	desc: "Displays information selected about BDO, ie. AP/DP bracket information etc",
	example: "!bdoinfo [selection]"
}
