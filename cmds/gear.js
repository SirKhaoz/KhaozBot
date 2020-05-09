const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.run = async (bot, message, args) => {
	let user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
	let attstatus = ValidContent(message);

	if(!args[0] && message.attachments.size <= 0){
		if(!bot.bdoplayers[message.author.id]){
			return message.reply("You have not logged any gear in the database.");
		}else{
			return message.reply(`Showing your gear,`, {files: [{
				attachment: `${bot.bdoplayers[message.author.id].gearpic}`,
				name: `${bot.bdoplayers[message.author.id].gearpic}`
			}]});
		}
	}else if(user){
		if(!bot.bdoplayers[user.id]){
			return message.reply(user + " has not logged any gear in the database.");
		}else{
			return message.reply(`Showing gear of ${user},`, {files: [{
				attachment: `${bot.bdoplayers[user.id].gearpic}`,
				name: `${bot.bdoplayers[user.id].gearpic}`
			}]});
		}
	}else if(attstatus[0]){
		if(bot.bdoplayers[message.author.id]) {
			try{
				fs.unlinkSync(bot.bdoplayers[message.author.id].gearpic);
			}catch(e){
				console.log("Missing old gear file?");
			}
		}
		let upfiletype = path.extname(message.attachments.first().url).toLowerCase();
		download(message.attachments.first().url,`./resources/bdogear/${message.author.id}_gearpic_0${upfiletype}`, function (err, fd){
			if(!bot.bdoplayers[message.author.id]){
				bot.bdoplayers[message.author.id] = {"gearpic": `./resources/bdogear/${message.author.id}_gearpic_0${upfiletype}`};
				message.reply(`I have added you and your gear to the database:`, {files: [{
					attachment: `${bot.bdoplayers[message.author.id].gearpic}`,
					name: `${bot.bdoplayers[message.author.id].gearpic}`
				}]});
			}else{
				bot.bdoplayers[message.author.id].gearpic = `./resources/bdogear/${message.author.id}_gearpic_0${upfiletype}`
				message.reply(`I have updated your gear for you:`, {files: [{
					attachment: `${bot.bdoplayers[message.author.id].gearpic}`,
					name: `${bot.bdoplayers[message.author.id].gearpic}`
				}]});
			}
		});
	}else if(!attstatus[0] && message.attachments.size > 0){
		return message.reply(`Upload failed with reason: *'${attstatus[1]}'*.`)
	}else{
		return message.reply("(gear help) Please do one of the following:\n1. Type !gear to see your saved gear (if any).\n\
2. Type !gear and attach/paste a picture of your gear to save in the database.\n\
3. Type !gear @mention someone to see their saved gear (if any).\n\
4. Type !gear clear to clear your saved picture.");
	}
}

function ValidContent(message) {
  	if (message.attachments.size <= 0) return [false, "no attachment"];
  	if (message.attachments.first().filesize > 8000000) return [false, "size"];
	if (message.attachments.first().url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) == null) return [false, "not picture"];
	return [true, true];
}

function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const sendReq = request.get(url);

    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        sendReq.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};

module.exports.help = {
	name: "gear",
	type: "bdo",
	desc: "Stores gear in the database, or displays a mentioned user's gear.",
	example: "!gear [url of image to store] *or* !gear *or* !gear [@mention]"
}
