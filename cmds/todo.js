module.exports.run = async (bot, message, args) => {
	return message.channel.send(`List of things I'm working on, if I've remembered to update it:\n\
\`\`\`md\n1. Fix twitch bot (Adding OAUTH2 call)\n\
2. Add !fitness command\n\
3. Update !slap command to count slaps by/to user\n\
4. Fix !gear command moving from other channel, solution might be to investigate calling seperately after saving image\n\
5. Finish !restore command to restore from backup (config)\n\
6. Update twitch bot to cache user information to reduce api calls (display pics etc)\n\
7. Text level up? Like mee6 bot\n\
8. Update !help to dynamically adjust for max size, display in nice code block??\n\
\`\`\``);
}

module.exports.help = {
	name: "todo",
	type: "static",
	desc: "What Khaoz is working on right now.",
	example: "!todo"
}
