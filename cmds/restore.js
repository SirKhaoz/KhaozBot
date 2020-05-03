const fs = require('fs');
const { readdirSync } = require('fs')
const dir = './backup/';
const newdir = './';
const getDirectories = source => readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
const getFiles = source => readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name);

module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(bot.authusers[message.member.id].admin != 1) return message.reply(`You do not have permission to do this. Requires: Global **ADMIN** permissions.`);

	if(!args[0]){
		let msg = await message.reply(`Please specify a directory to restore from. Use !restore list to display a list of sub-directories.`);
		msg.delete(7000).catch(err => console.log(err));
		return;
	} else if (args[0] == "list"){
		let body = `**List of directories within ${dir} :**\n\n`; 
		getDirectories(dir).forEach(d => {
			body += ("-- " + d +"\n")
		});
		let msg = await message.reply(body);
		msg.delete(30000).catch(err => console.log(err));
		return;
	} else if(getDirectories(dir).includes(args[0])){
		fs.readdir(dir + args[0], (err, files) => {
  			message.reply(`restoring ${files.length} files from '${dir + args[0]}', please wait...`);
		});
		getFiles(dir+args[0]).forEach(f => {
			copyFile(dir+args[0]+'/'+f, newdir+args[0]+'/'+f)
		});//.then(message.reply(`All done. ${files.length} sucessfully restored.`));
	} else {
		let msg = await message.reply(`No such directory found in '${dir}'`);
		msg.delete(7000).catch(err => console.log(err));
		return;
	}
}

async function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  try {
    return await new Promise(function(resolve, reject) {
      rd.on('error', reject);
      wr.on('error', reject);
      wr.on('finish', resolve);
      rd.pipe(wr);
    });
  } catch (error) {
    rd.destroy();
    wr.end();
    throw error;
  }
}

module.exports.help = {
	name: "restore",
	type: "static",
	desc: "Provides bot restore status.",
	example: "!restore [folder]"
}