module.exports.run = async (bot, message, args) => {
	let exlucderoles = ["Tourettes","Muted","@everyone"];

	let togiverole = message.guild.member(message.author);
	let botrole = message.guild.roles.filter(r => r.name.toLowerCase().includes("khaozbot")).first();

	let rolenames = message.guild.roles.filter(r=>r.calculatedPosition < botrole.calculatedPosition && !exlucderoles.includes(r.name)).map(r=>r.name);
	rolenames = rolenames.join(", ");

	if(!args[0]){
		let msg = await message.reply(`You did not specify a role to subscribe to. The roles you can sub to are:\n ${rolenames}`);
		msg.delete(60000).catch(err => console.log(err));
		return;
	}

	let role = message.guild.roles.filter(r => r.name.toLowerCase().includes(args[0].toLowerCase())).first();

	if(!role){
		let msg = await message.reply(`Could not find the role you specified. The roles you can sub to are:\n ${rolenames}`);
		msg.delete(60000).catch(err => console.log(err));
		return;
	}

	if(role.position >= botrole.position){
		let msg = await message.reply(`You can not sub to this role. The roles you can sub to are:\n ${rolenames}`);
		msg.delete(60000).catch(err => console.log(err));
		return;
	}

	if(togiverole.roles.has(role.id)){
		await togiverole.removeRole(role);
		message.reply(`Okay, I have removed the subscription to ${role} for you.`);
	} else {
		await togiverole.addRole(role);
		message.reply(`Okay, I have added the subscription to ${role} for you.`);
	}
}

module.exports.help = {
	name: "sub",
	type: "command",
	desc: "Subs or Unsubs to the specified role.",
	example: "!subscribe [role]"
}