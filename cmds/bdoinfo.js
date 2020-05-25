const fs = require('fs');

module.exports.run = async (bot, message, args) => {
	args = args.map(w => w.toLowerCase());

	if(args[0] == "1"){
		message.channel.send(`**BDO AP/DP Bracket Information:**`, {files: [{
			attachment: `./resources/bdoinfo/apdpbrackets.png`,
			name: `BDO AP/DP Bracket Information.png`
		}]});
	} else if (args[0] == "2") {
		message.channel.send(`**Caphras Information Sheet:** https://docs.google.com/spreadsheets/d/1eAhNxjx0bP5Z1DxZBspYzssVCt1wgJmeFnBwRQHDZkM/edit#gid=0`)
	} else if(args[0] == "3"){
		message.channel.send(`**Party Combat EXP Information:**`, {files: [{
			attachment: `./resources/bdoinfo/combatxpinfo.png`,
			name: `Party Combat EXP Information.png`
		}]});
	} else if (args[0] == "4") {
		message.channel.send(`**Manos Tools/Gear Crafting:** https://saarith.com/bdo-how-to-make-manos-clothes-tools-and-accessories/`)
	} else if (args[0] == "5") {
		message.channel.send(`**Horse Calculator:** http://www.somethinglovely.net/bdo/horses/`)
	} else if(args[0] == "6"){
		message.channel.send(`**Information on basic alchemy ingredients/recipies:**\n\
http://dulfy.net/2016/05/08/black-desert-alchemy-life-skill-guide/\n\
https://incendar.com/bdoalchemyrecipes.php`, {files: [{
			attachment: `./resources/bdoinfo/alchbase.png`,
			name: `Basic Alchemy Ingredients.png`
			}]
		});
	} else if (args[0] == "7") {
		message.channel.send(`**Bartali book adventure guides:**\n\
**Part 1-10:** <https://docs.google.com/document/d/1_36I1ah01yVhZ59jUDx45SnkdhNrnp3ey6DgDeqV5Vg/edit>\n\
**Part 11-15:** <https://docs.google.com/document/d/1sxN87MfNPDJEhtOg5qyfd5pcRi_yjheyiYLhanWCRFU/edit>`)
} else if (args[0] == "8") {
		message.channel.send(`**Useful BDO Knowledge-Locator Tool:**\n\
		https://grumpygreen.cricket/old-site/bdo-knowledge-locator.html`)
	} else if(args[0] == "9"){
		message.channel.send(`**Unlimited Potion Information:**`, {files: [{
			attachment: `./resources/bdoinfo/unlimitedpotionmats.png`,
			name: `Unlimited Potion Information.png`
		}]});
		message.channel.send(`**Unlimited Potion *EVENT* Information:**`, {files: [{
			attachment: `./resources/bdoinfo/unlimitedpotionmats-event.png`,
			name: `Unlimited Potion EVENT Information.png`
		}]});
	} else if (args[0] == "10") {
		message.channel.send(`**Kutum vs Nouver Calculator:** https://docs.google.com/spreadsheets/d/1X6aSmVU8zxLh8Nsc9o3poNdgMAvX01Dze8f9k7YdF00`)
	} else if(args[0] == "11"){
		message.channel.send(`**Information on how to change your BDO font:**`, {files: [{
			attachment: `./resources/bdoinfo/fontchange.png`,
			name: `Font Change Information.png`
		}]});
	} else if (args[0] == "12") {
		message.reply("TODO? YOU CHOSE TODO??????????? PM <@Khaoz#1337> A SUGGESTION THEN FFS")
	} else {
		message.reply(`Please enter a valid option\n(**type a number only, ie.** \`!bdoinfo 1\`). The options to chose from are:\n\
\`\`\`md\n# Gear & Leveling:\n\
1. Brackets\n\
2. Caphras Information Sheet\n\
3. Party combat EXP information\n\
# Crafting/Life-Skills:\n\
4. Manos Tools/Gear Crafting
5. Horse Calculator
6. Basic Alchemy Ingredients/Recipies\n\
# Adventure Logs/Books:\n\
7. Bartali Adventure Books\n\
- Find me a guide for the rest of the books and I will add.
# Progression:\n\
8. Knowledge Locatior Tool\n\
9. Kutum vs Nouver Calculator (MAKE A COPY TO USE)\n\
10. Unlimited Potions\n\
# Misc:\n\
11. How to change your BDO Fonts\n\
12. TODO\`\`\``);
		return;
	}
}

module.exports.help = {
	name: "bdoinfo",
	type: "static",
	desc: "Displays information selected about BDO, ie. AP/DP bracket information etc",
	example: "!bdoinfo [selection]"
}
