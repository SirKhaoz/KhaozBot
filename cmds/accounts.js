const Discord = module.require("discord.js");
const lolaccounts = require("../resources/lolaccounts.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	const filter = m => m.author.id == message.author.id;

	if(bot.authusers[message.member.id].accounts != 1) return message.reply("You do not have permission to view/edit accounts in the database.");

	let accountname = null;
	let optionchoice = null;

	message.reply("what would you like to do? [view/edit/add/remove]")
	message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
		if(collected.first().content.toLowerCase() == "add"){
			message.reply("please enter the account name:");
			message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
				bot.lolaccounts[collected.first().content.toLowerCase()] = {name: collected.first().content, username: null, password: null, solorank: null, flexrank: null, champs: null};
				message.reply(`Account name set as: ${collected.first().content}`);
				accountname = collected.first().content.toLowerCase();
				message.reply("please enter the account's username:");
				message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
					bot.lolaccounts[accountname].username = collected.first().content;
					message.reply(`Account username set as: ${collected.first().content}`);
					message.reply("please enter the account's password (case sensitive!):");
					message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
						bot.lolaccounts[accountname].password = collected.first().content;
						message.reply(`Account password set as: ${collected.first().content}`);
						message.reply("please enter the account's solo rank:");
						message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
							bot.lolaccounts[accountname].solorank = collected.first().content.toUpperCase();
							message.reply(`Solo rank set as: ${collected.first().content.toUpperCase()}`);
							message.reply("please enter the account's flex rank:");
							message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
								bot.lolaccounts[accountname].flexrank = collected.first().content.toUpperCase();
								message.reply(`Flex rank set as: ${collected.first().content.toUpperCase()}`);
								message.reply("All done! Your account is now in the database.")
							});
						});
					});
				});
			});
		} else if (collected.first().content.toLowerCase() == "remove") {
			message.reply("please enter the account name:");
			message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
				if (bot.lolaccounts[collected.first().content.toLowerCase()]) {
					accountname = collected.first().content.toLowerCase();
					message.reply(`are you sure you wish to delete *${accountname}*? [yes/no]`);
					message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
						if (collected.first().content.toLowerCase() == "yes") {
							delete bot.lolaccounts[accountname];
							return message.reply(`account *${accountname}* deleted.`)
						} else {
							return message.reply("account not deleted, quitting.")
						}
					});
				} else {
					return message.reply("no such account found, quitting.");
				}
			});
		} else if (collected.first().content.toLowerCase() == "edit") {
			message.reply("please enter the account name:");
			message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
				if (bot.lolaccounts[collected.first().content.toLowerCase()]) {
					accountname = collected.first().content.toLowerCase();
					message.reply(`what would you like to edit for *${accountname}*? [name/username/password/solo rank/flex rank/champs]`);
					message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
						optionchoice = collected.first().content.toLowerCase();
						message.reply(`what would you like to change the ${optionchoice} of *${accountname}* to?`);
						message.channel.awaitMessages(filter, { max: 1, time: 30000}).then(collected => {
							bot.lolaccounts[accountname][optionchoice] = collected.first().content.toLowerCase();
						});
						// if (collected.first().content.toLowerCase() == "name") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else if (collected.first().content.toLowerCase() == "username") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else if (collected.first().content.toLowerCase() == "password") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else if (collected.first().content.toLowerCase() == "solo rank") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else if (collected.first().content.toLowerCase() == "flex rank") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else if (collected.first().content.toLowerCase() == "champs") {
						// 	message.reply(`placeholder, not implemented.`)
						// } else {
						// 	return message.reply("invalid response, quitting.")
						// }
					});
				} else {
					return message.reply("no such account found, quitting.");
				}
			});
		} else {
			return message.reply("Not a valid option, quitting.");
		}
	}).catch(err => {
		message.reply(`ERROR: ${err}. See <@78306944179245056>.`);
	});
}

module.exports.help = {
	name: "accounts",
	type: "command",
	desc: "View/Edit league accounts in the databse. Only special people are allowed to use this.",
	example: "!accounts [view/edit/add/remove]"
}