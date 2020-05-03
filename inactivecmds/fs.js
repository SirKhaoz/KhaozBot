const Discord = module.require("discord.js");
const fsData = require("../resources/bdofs.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(!args[0] || /[^\d]/.test(args[0]) || args[0] > 19 || args[0] < 0) {
		let msg = await message.reply("Please enter a valid number between 0-19");
		msg.delete(7000);
		return;
	}
	if(args[1] && (/[^\d]/.test(args[1]) || args[1] < 0)) {
		let msg = await message.reply("Please enter a valid number above 0 for the # of fail stacks.");
		msg.delete(7000);
		return;
	}

	if(!args[1]) args[1] = 0;
	let failstacks = args[1];

	let info = await failstackMath(args[0], failstacks)

	let desc = `Current Enchantment Level: **+${args[0]}`
	if(isNaN(fsData[args[0]].armourenhtype)) desc += ` (${fsData[args[0]].armourenhtype})`
	desc += `**\nFail Stack Count **${failstacks}**\n\nGoing to:`

	let fsembed = new Discord.RichEmbed()
		//.setThumbnail(`${summonericonurl}`)
		.setTitle(`BDO Failstack Calculator`)
		.setDescription(desc)
		.setFooter(`This message will auto-delete in 60 seconds.`, message.author.avatarURL)

	let armourfield = `Armour +${parseInt(args[0])+1} :shield:`
	if(isNaN(info[4])) armourfield += ` (${info[4]})`
	fsembed.addField(armourfield, info[0], true)

	let weaponfield = `Weapon +${parseInt(args[0])+1} :crossed_swords:`
	if(isNaN(info[5])) weaponfield += ` (${info[5]})`
	fsembed.addField(weaponfield, info[1], true)

	if(args[0] <= 4){
		let accfield = `Accessory +${parseInt(args[0])+1} :ring:`
		if(isNaN(info[6])) accfield += ` (${info[6]})`
		fsembed.addField(accfield, info[2], false)
	}

	let msg = await message.reply(info[3], {embed: fsembed});
	msg.delete(60000); //Delete message after 30 seconds
}

function failstackMath (enchantNo, failstacks){
	let arminfo;
	let wepinfo;
	let accinfo;

	let enhanceerror = "";

	let armenhtype = fsData[Number(enchantNo) + 1].armourenhtype;
	let wepenhtype = fsData[Number(enchantNo) + 1].weaponenhtype;
	let accenhtype = fsData[Number(enchantNo) + 1].accenhtype;

	let armbase = fsData[enchantNo].armourbase;
	let wepbase = fsData[enchantNo].weaponbase;
	let accbase = fsData[enchantNo].accbase;

	let armperchance = fsData[enchantNo].armourperfs;
	let wepperchance = fsData[enchantNo].weaponperfs; 
	let accperchance = fsData[enchantNo].accperfs; 

	let armmaxfs = fsData[enchantNo].armourmaxfs;
	let wepmaxfs = fsData[enchantNo].weaponmaxfs;
	let accmaxfs = fsData[enchantNo].accmaxfs;

	let armmaxchance = armbase + (armperchance * armmaxfs);
	let wepmaxchance = wepbase + (wepperchance * wepmaxfs);
	let accmaxchance = accbase + (accperchance * accmaxfs);

	let armuserchance = armbase + (armperchance * failstacks);
	let wepuserchance = wepbase + (wepperchance * failstacks);
	let accuserchance = accbase + (accperchance * failstacks);

	if(isNaN(armenhtype)){
		//Do nothing
	} else { 
		armenhtype = 0;
	}
	if(isNaN(wepenhtype)){
		//Do nothing
	} else { 
		wepenhtype = 0;
	}
	if(isNaN(accenhtype)){
		//Do nothing
	} else { 
		accenhtype = 0;
	}

	if (armuserchance > armmaxchance) {
		console.log("armuserchance " + armuserchance)
		console.log("armmaxchance " + armmaxchance)
		armuserchance = armmaxchance;
		enhanceerror = "```asciidoc\n[You have above the maximum failstacks for this enchant!]```"
	}
	if (wepuserchance > wepmaxchance) {
		console.log("wepuserchance " + wepuserchance)
		wepuserchance = wepmaxchance;
		enhanceerror = "```asciidoc\n[You have above the maximum failstacks for this enchant!]```"
	}
	if (accuserchance > accmaxchance) {
		console.log("accuserchance " + accuserchance)
		accuserchance = accmaxchance;
		enhanceerror = "```asciidoc\n[You have above the maximum failstacks for this enchant!]```"
	}

	if(armbase == 100){
		arminfo = `Enchant Chance: **${armbase}%**`
	}
	else{
		arminfo = `Enchant Chance: **${(armuserchance).toFixed(2)}%** \n *(+${armperchance.toFixed(2)}% per FS)*\n`
		arminfo += `Max. Chance: **${(armmaxchance).toFixed(2)}%**\n`
		arminfo += ` *(${armmaxfs} FS)*`
	}

	if(wepbase == 100){
		wepinfo = `Enchant Chance: **${wepbase}%**`
	}
	else{
		wepinfo = `Enchant Chance: **${(wepuserchance).toFixed(2)}%** \n *(+${wepperchance.toFixed(2)}% per FS)*\n`
		wepinfo += `Max. Chance: **${(wepmaxchance).toFixed(2)}%**\n`
		wepinfo += ` *(${wepmaxfs} FS)*`
	}
	if(enchantNo <= 4){
		accinfo = `Enchant Chance: **${(accuserchance).toFixed(2)}%** \n *(+${accperchance.toFixed(2)}% per FS)*\n`
		accinfo += `Max. Chance: **${(accmaxchance).toFixed(2)}%**\n`
		accinfo += ` *(${accmaxfs} FS)*`
	}



	return [arminfo,wepinfo,accinfo,enhanceerror,armenhtype,wepenhtype,accenhtype];
}

module.exports.help = {
	name: "fs",
	type: "bdo",
	desc: "Displays the failstack information for a particular level (BDO).",
	example: "!fs [level 0-19] *or* !fs [level 0-19] [stacks]"
}