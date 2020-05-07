const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(!message.member.permissions.has("MUTE_MEMBERS")) return message.reply("You do not have permission to mute people.");
	//Get the mentioned user, either mention or full ID
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	//If no specified @ user mention, return error to user
	if(!toMute) return message.reply("You did not specify a user mention to mute!");
	//Prevent muting of bot
	if(toMute.user.bot) return message.reply("You can not mute a Bot via this command.");
	//Prevent muting of admin
	if(toMute.permissions.has("ADMINISTRATOR")) return message.reply("You can not mute an Admin via this command.");
	//Prevent self-muting
	if(toMute.id === message.author.id) return message.reply("Why are you trying to mute yourself?");
	//Prevenet muting of higher or equal role
	if(toMute.roles.highest.position >= message.member.roles.highest.position) return message.reply("You can not mute someone with a higher or equal role as yourself.");

	//Attempt to find pre-exsisting role of "Muted"
	let role = message.guild.roles.cache.find(r => r.name === "Muted");
	//If no role, create role
	if(!role){
		try{
			role = await message.guild.roles.create({
				data:{
					name: "Muted",
					color: "#ff0000",
					permissions: []
				},
				reason: "Created to mute/unmute people by KhaozBot"
			});

			message.guild.channels.cache.forEach(async (channel, id) => {
				await channel.createOverwrite(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});

		}catch(e){
			console.log(e.stack);
		}

	}

	if(toMute.roles.cache.has(role.id)) return message.reply("This user is already muted! Use !unmute to un-mute them.");

	//Checking to see if additional args was a number
	if(args[1]) {
		if(isNaN(parseInt(args[1].trim()))) return message.reply("Please specify a correct amount of time, in seconds, or none for a 'permanent' mute.");

		bot.mutes[toMute.id] = {
			guild: message.guild.id,
			time: Date.now() + parseInt(args[1]) * 1000
		}
	}
	else{
		bot.mutes[toMute.id] = {
			guild: message.guild.id,
			time: "null"
		}
	}

	await toMute.roles.add(role);

	let adminChannel = message.guild.channels.cache.filter(c=>c.id == bot.guildSettings[message.guild.id].adminchannel).first();
	let muteEmbed = new Discord.MessageEmbed()
		.setDescription("--- **MUTED:** ---")
		.setColor("#0099CC")
		.addField("Muted user:", `${toMute} (${toMute.displayName}) with ID of ${toMute.id}`)
		.addField("Muted by:", `${message.author}`)
		.addField("Time:", message.createdAt)
	adminChannel.send(muteEmbed);

	message.reply(`I have muted ${toMute} for you.`);
}

module.exports.help = {
	name: "mute",
	type: "ṣtatic",
	desc: "Mutes a user indefinatley, or for a specified time in seconds.",
	example: "!mute [@user] [time in seconds] *or* !mute [@user]"
}
