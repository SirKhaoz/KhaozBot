const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(!args[0]){
		if(!bot.logusers[message.author.id]){
			let msg = await message.channel.send("You don't have a log! Try adding something to your log first.");
			msg.delete(7000);
			return;
		}
		if(bot.logusers[message.author.id].items.length == 0){
			let msg = await message.channel.send("You have nothing in your log! Try adding something to your log first.");
			msg.delete(7000);
			return;
		}
		let logmessage = "**Your log contains:**\n";
		let logtaxable = 0;
		let lognottaxable = 0;
		for (i = 0; i < bot.logusers[message.author.id].items.length; i++){
			logmessage += (i+1) + ") " + formatInt(bot.logusers[message.author.id].items[i].quantity) + "x " + bot.logusers[message.author.id].items[i].name + " - " + formatInt(bot.logusers[message.author.id].items[i].price) + "/ea | Total: " + formatInt(bot.logusers[message.author.id].items[i].price * bot.logusers[message.author.id].items[i].quantity) + "\n"
			if(bot.logusers[message.author.id].items[i].taxable){
				logtaxable = logtaxable + bot.logusers[message.author.id].items[i].price * bot.logusers[message.author.id].items[i].quantity;
			} else {
				lognottaxable = lognottaxable + bot.logusers[message.author.id].items[i].price * bot.logusers[message.author.id].items[i].quantity;
			}
		}
		logmessage += "\nTotal untaxable: " + formatInt(lognottaxable)
		logmessage += "\nTotal taxable: " + formatInt(logtaxable)
		logmessage += "\nTotal taxable after tax: " + formatInt(logtaxable * 0.845)
		logmessage += "\n\n**TOTAL PROFIT: " + formatInt(lognottaxable + (logtaxable * 0.845)) + "**"
		message.reply(logmessage);
		return;
	} else if(args[0] == "item"){
		args.shift();
		let price = parseInt(args.pop());
		if(isNaN(price)){
			let msg = await message.channel.send("Invalid price quantity, did you correctly specify a decimal for the price of the item?");
			msg.delete(7000);
			return;
		}
		let itemname = args.join(" ").toLowerCase();

		var inlog = bot.logitems[itemname] ? true : false;

		bot.logitems[itemname] = {name: itemname, price: price, taxable: true, lastedit: Date.now()}
		if(!inlog){
			message.reply(`Added '**${capitalize(bot.logitems[itemname].name)}**' to the item list, with price of *${formatInt(bot.logitems[itemname].price)}* per item.`);
		} else {
			message.reply(`Edited '**${capitalize(bot.logitems[itemname].name)}**' in the item list, to a price of *${formatInt(bot.logitems[itemname].price)}* per item.`);
		}
		return;
	} else if(args[0] == "trash"){
		args.shift();
		let price = parseInt(args.pop());
		if(isNaN(price)){
			let msg = await message.channel.send("Invalid price quantity, did you correctly specify a decimal for the price of the item?");
			msg.delete(7000);
			return;
		}
		let itemname = args.join(" ").toLowerCase();

		var inlog = bot.logitems[itemname] ? true : false;

		bot.logitems[itemname] = {name: itemname, price: price, taxable: false, lastedit: Date.now()}
		if(!inlog){
			message.reply(`Added '**${capitalize(bot.logitems[itemname].name)}**' to the item list, with price of *${formatInt(bot.logitems[itemname].price)}* per item.`);
		} else {
			message.reply(`Edited '**${capitalize(bot.logitems[itemname].name)}**' in the item list, to a price of *${formatInt(bot.logitems[itemname].price)}* per item.`);
		}
		return;
	} else if(args[0] == "add"){
		args.shift();
		let quantity = parseInt(args.pop());
		if(isNaN(quantity)){
			let msg = await message.channel.send("Invalid quantity, did you correctly specify a decimal for the quantity of the item?");
			msg.delete(7000);
			return;
		}
		let itemname = args.join(" ").toLowerCase();

		if(!bot.logitems[itemname]){
			let msg = await message.reply(`Not a recognised item in the items list! Please use *!log item [item] [price]* to add it first.`);
			msg.delete(7000);
			return;
		}
		
		if(!bot.logusers[message.author.id]) bot.logusers[message.author.id] = {items: [], totalpricenotax: 0, totalpricewithtax: 0};

		let index = indexOfObjectByName(bot.logusers[message.author.id].items, itemname);
		if(index != -1 && bot.logusers[message.author.id].items[index].price == bot.logitems[itemname].price){
			bot.logusers[message.author.id].items[index].quantity = bot.logusers[message.author.id].items[index].quantity + quantity;
			message.reply(`Added (*${formatInt(quantity)}*) **${capitalize(bot.logitems[itemname].name)}** to your personal item log. Total price is now **${formatInt(bot.logusers[message.author.id].items[index].quantity * bot.logusers[message.author.id].items[index].price)}**.`);
		} else {
			bot.logusers[message.author.id].items.push({name: bot.logitems[itemname].name, price: bot.logitems[itemname].price, quantity: quantity, taxable: bot.logitems[itemname].taxable});
			message.reply(`Added **${capitalize(bot.logitems[itemname].name)}** to your personal item log, quantity of (*${formatInt(quantity)}*) for a total price of **${formatInt(quantity * bot.logitems[itemname].price)}**.`);
		}
		return;
	} else if(args[0] == "remove"){
		args.shift();

		let quantity = parseInt(args.pop());
		if(isNaN(quantity)){
			let msg = await message.channel.send("Invalid quantity, did you correctly specify a decimal for the quantity of the item?");
			msg.delete(7000);
			return;
		}
		let itemname = args.join(" ").toLowerCase();

		if(!bot.logitems[itemname]){
			let msg = await message.reply(`Not a recognised item in the items list! Can't remove item!`);
			msg.delete(7000);
			return;
		}

		if(!bot.logusers[message.author.id]) bot.logusers[message.author.id] = {items: [], totalpricenotax: 0, totalpricewithtax: 0};

		let index = indexOfObjectByName(bot.logusers[message.author.id].items, itemname);
		if(index == -1){
			let msg = await message.reply(`No ${capitalize(itemname)} in your item log to remove!`);
			msg.delete(7000);
			return;
		}

		if(bot.logusers[message.author.id].items[index].quantity <= quantity){
			bot.logusers[message.author.id].items.splice(index, 1);
			message.reply(`Removed all **${capitalize(bot.logitems[itemname].name)}** from your personal item log.`);
		} else {
			bot.logusers[message.author.id].items[index].quantity = bot.logusers[message.author.id].items[index].quantity - quantity;
			message.reply(`Removed (*${formatInt(quantity)}*) **${capitalize(bot.logitems[itemname].name)}** from your personal item log. You now have ${formatInt(bot.logusers[message.author.id].items[index].quantity)} left in your log.`);
		}
		return;
	} else if(args[0] == "clear"){
		bot.logusers[message.author.id].items.length = 0;
		message.reply("Your log has been cleared. Forever, boom, gone, bye-bye, can't get it back.");
		return;
	} else if(args[0] == "database"){
		args.shift();
		if(args[0] == "list"){
			let databasemessage = "**ALL ITEMS IN DATABASE:**\n";
			for(i in bot.logitems){
				var tempMessage = bot.logitems[i].name + ": price - " + bot.logitems[i].price + "/ea, taxable: " + bot.logitems[i].taxable + ", last edited: " + bot.logitems[i].lastedit + "\n"
				if((databasemessage + tempMessage).length <= (2000 - 3)) {
					databasemessage += tempMessage;
				}
				else {
					message.channel.send(databasemessage);
					databasemessage = "";
				}	
			}
			message.channel.send(databasemessage);
		}
	} else {
		let msg = await message.channel.send("Please enter a valid paramater.\nValid commands are:\n\
**!log** - displays your total profit/log.\n\
**!log item [name] [price]** - adds an item to the database, this is always a taxable item.\n\
**!log trash [name] [price]** - adds an item to the database, this is always a non-taxable item.\n\
**!log add [name] [quantity]** - adds an item to your personal log, uses the information in the database re: price/taxable.\n\
**!log remove [name] [quantity]** - removes an item from your personal log.\n\
**!log clear** - clears your entire log. This cannot be undone, be careful.\n\
**!log [anything else]** - will display this message.\
");
		msg.delete(120000);
		return;
	}
}

module.exports.help = {
	name: "log",
	type: "bdo",
	desc: "Collection log for tallying items.",
	example: "!log help for more info"
}

function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].name.toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

function formatInt(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}