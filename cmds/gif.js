const nodefetch = require("node-fetch");
const botSettings = require("../resources/keys.json");
const GiphyClient = require('giphy-js-sdk-core')

module.exports.run = async (bot, message, args) => {
	gifSearch = GiphyClient(botSettings.giphy_api_key);

	//Quick check to see if user has not given a name.
	if(!args[0]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.reply("Please enter a search term for a gif to search for...");
		msg.delete({timeout:7000});
		return;
	}

	let gifnumber = 0;

	if(isNaN(parseInt(args[1]))){
		if(args[0].toLowerCase() == "random"){
			gifSearch.random('gifs', {}).then((response) => {
				message.reply(response.data.url);
			}).catch((err) => {
				console.log(err);
			});
			return;
		} else {
			args[0] = args.join(" ")
		}
	}
	else{
		if(!args[1] || /[^\d]/.test(args[1]) || args[1] > 10 || args[1] < 1) {
			let msg = await message.channel.send("Please enter a valid number between 1-10");
			msg.delete({timeout:7000});
			return;
		} else {
			gifnumber = args[1] - 1;
		}
	}

	gifSearch.search('gifs', {"q": args[0]}).then((response) => {
    //	response.data.forEach((gifObject) => {
    //  	//message.channel.send(gifObject);
    //  	console.log(gifObject.url);
    //	});
    	// for(let i = 0; i < 1; i++ ) {
    		message.reply(response.data[gifnumber].url);
    	// }

  	}).catch((err) => {
  		console.log(err);
  	});
}

module.exports.help = {
	name: "gif",
	type: "static",
	desc: "Searches for a gif based on a search term entered. Optional 'gif number'\nwhich can be used to select another gif of the same search.",
	example: "!gif [search term] *or* !gif [search term] [gif number]"
}
