const Discord = require("discord.js");
const nodefetch = require("node-fetch");
const botSettings = require("../resources/keys.json");
const runesData = require("../resources/lolrunes.json");
const championsData = require("../resources/lolchampions.json");
const ssData = require("../resources/lolsummonerspells.json");
const mapsData = require("../resources/lolmaps.json");
const gamemodesData = require("../resources/lolgamemodes.json");
const versionsData = require("../resources/lolversions.json");

const timeout = 1*60000;

//Declare base api paths. We will add to this with the user's specified or defined arguments & our private api key.
var getSummonerID = 	"https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
var currentGameInfo = 	"https://oc1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/";
var getRankInfo = 		"https://oc1.api.riotgames.com/lol/league/v4/positions/by-summoner/"

module.exports.run = async (bot, message, args) => {
	if(bot.authusers[message.member.id].admin != 1) return message.reply(`I'm working on this at the moment. This broke with the latest RIOT API update.`);
	//Quick check to see if user has not given a name.
	if(!args[0]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.channel.send("Please enter a summoner name.");
		msg.delete(7000);
		return;
	}

	let summonerName = "";
	if(args[0] == "add"){
		if(!message.member.permissions.has("ADMINISTRATOR")) {
			let msg = await message.reply("You do not have permission to do this.");
			msg.delete(7000).catch(err => console.log(err));
			return;
		}

		args = args.slice(1);
		summonerName = args.join(" ");

        index = indexOfObjectByName(bot.guildSettings[message.guild.id].summonerNames, summonerName);
        if(index != -1){
            message.reply(summonerName + " is already in the list.");
        }else{
            bot.guildSettings[message.guild.id].summonerNames.push({name: summonerName, timestamp: 0, gameID: 123,});
            message.reply("Added " + summonerName + ".");
            exports.tick();
        }
        return;
	} else if(args[0] == "remove"){
		if(!message.member.permissions.has("ADMINISTRATOR")) {
			let msg = await message.reply("You do not have permission to do this.");
			msg.delete(7000).catch(err => console.log(err));
			return;
		}

        args = args.slice(1);
		summonerName = args.join(" ");

        index = indexOfObjectByName(bot.guildSettings[message.guild.id].summonerNames, summonerName);
        if(index != -1){
            bot.guildSettings[message.guild.id].summonerNames.splice(index, 1);
            index = indexOfObjectByName(bot.guildSettings[message.guild.id].summonerNames, summonerName);
            if(index == -1){
                message.reply("Removed " + summonerName + ".");
            }else{
                message.reply(summonerName + " isn't in the list.");
            }
        }else{
            message.reply(summonerName + " isn't in the list.");
        }
        return;
	} else {
		summonerName = args.join(" ");
	}

	exports.callApi(message.guild.id, summonerName);

	return; //The end of the command.
}

exports.updateStaticData = function (patchVersion, staticDataVersion, message){
	let isJSON = false;

    try {
        JSON.parse("JSON OBJECT RESULT OF API RESPONSE HERE");
    } catch (e) {
        isJSON = false;
    } finally {
    	isJSON = true;
    }

}

exports.callApi = function(guildID, summonerName){
	var guild = bot.guilds.cache.find("id", (guildID));
    var channel = guild.channels.cache.filter(c => c.id === bot.guildSettings[guildID].leaguechannel).first();

	//Append users input to the getSummonerID api path, with our api key on the end.
	getSummonerID += summonerName + "?api_key=" + botSettings.riotapikey;
	sleep(1500);

	//First API call, this is to get the summoner ID from the summoner name, note that there is a .catch statement below.
	nodefetch.get(getSummonerID).then(r => {
		//We now append the summoners ID from the reply, as well as our api key again.
		currentGameInfo += r.body.id + "?api_key=" + botSettings.riotapikey;
		console.log(currentGameInfo);
		let summonericonurl = `http://ddragon.leagueoflegends.com/cdn/${versionsData[0]}/img/profileicon/${r.body.profileIconId}.png`;

		//Second API call, this is to actually get the livegame (spectator) information for the summoner.
		nodefetch.get(currentGameInfo).then(async r => {
			//Simplification of variables, let body equal the body of the reply from the API GET request.
			let body = r.body;
			//Let gameType be the "lookedup" value of the gameQueueConfigId to the gamemodes list, we also take off the last 6 chars, for format.
			let gameType = gamemodesData[body.gameQueueConfigId].DESCRIPTION.slice(0,-6);
			//Check to see if its a ranked game, if it is, embolden the title for discord. Potential to add more formatting here later?
			if(gameType.toLowerCase().includes("ranked")) gameType = `**${gameType}**`;

			//Declare three new RichEmbed objects, one for the blue team, one for the purple and one for the general game info.
			//Some basic information and formatting is added here, along with the game id on the footer, colors etc.
			let gameembed = new Discord.RichEmbed()
					.setThumbnail(`${summonericonurl}`)
					.setTitle(`Livegame info for '${summonerName.charAt(0).toUpperCase() + summonerName.slice(1)}':`)
					.setDescription(`${summonerName.charAt(0).toUpperCase() + summonerName.slice(1)} is playing on ${mapsData.data[body.mapId].mapName}.\n\nThis is a ${gameType} Game.`)
					.setFooter(`Game ID is: ${body.gameId}`)
					.setTimestamp()
			let blueembed = new Discord.RichEmbed()
					.setDescription("Blue Team Summoner Information:")
					.setColor("#00008B")
			let purpembed = new Discord.RichEmbed()
					.setDescription("Red Team Summoner Information:")
					.setColor("#4B0082")

			//Set the gameID for this summoner in bot.guildSettings:

			if(bot.guildSettings[guildID].summonerNames.find(sum => sum.name === summonerName) && bot.guildSettings[guildID].summonerNames.find(sum => sum.name === summonerName).gameID != body.gameId){
				bot.guildSettings[guildID].summonerNames.find(sum => sum.name === summonerName).gameID = body.gameId;
			} else {
				return console.log(`${summonerName} is in the same game. Not posting stats.`);
			}

			//First we loop through for each summoner that is in the game:
			for(i = 0; i < body.participants.length; i++){
				//Declare summoner variable, set to the name of each summoner (taken from ID), slight formatting, setting the first char uppercase.
				let summoner = body.participants[i].summonerName.charAt(0).toUpperCase() + body.participants[i].summonerName.slice(1);
				//Then append the champion the summoner is playing, using the championsData JSON
				summoner += " - " + championsData.data[body.participants[i].championId].name;
				//Declare summoner info and masteries variables, which will be used in the next loops to get the data for each summoner, and format it.
				let summonerInfo = [];
				let masteries = [];
				//Set values of the summoner spells, which are simple, and only two properties of the reply JSON object.
				let ss1 = body.participants[i].spell1Id;
				let ss2 = body.participants[i].spell2Id;

				summonerInfo[0] = await nodefetch.get(`${getRankInfo}${body.participants[i].summonerId}?api_key=${botSettings.riotapikey}`).then(r => {
					let summonerRank = "";
					let soloRank = "\n";
					let flexRank = "\n";
					let threeRank = "\n";

					r.body.forEach(q => {
						let tier = q.tier;
						let seriesProgress;

						if(tier == "PLATINUM") tier = "PLAT";

						if(q.queueType == "RANKED_SOLO_5x5"){
							soloRank = (`SOLO: ${tier} ${q.rank}, *LP: ${q.leaguePoints}*\n`)
							if(q.miniSeries){
								let seriesLetters = [q.miniSeries.progress[0]];
								for(let i = 1; i < q.miniSeries.progress.length; i++){
									seriesLetters.push('-',q.miniSeries.progress[i]);
								}
								seriesProgress = seriesLetters.join('');
								seriesProgress = seriesProgress.replace(/N/gi,'O');
								seriesProgress = seriesProgress.replace(/W/gi,'&#10003');
								seriesProgress = seriesProgress.replace(/L/gi,'X');
								soloRank += (`**IN SOLO PROMOS ${seriesProgress}**\n`);
							}
						}
						else if(q.queueType == "RANKED_FLEX_SR"){
							flexRank = (`FLEX: ${tier} ${q.rank}, *LP: ${q.leaguePoints}*\n`)
							if(q.miniSeries){
								let seriesLetters = [q.miniSeries.progress[0]];
								for(let i = 1; i < q.miniSeries.progress.length; i++){
									seriesLetters.push('-',q.miniSeries.progress[i]);
								}
								seriesProgress = seriesLetters.join('');
								seriesProgress = seriesProgress.replace(/N/gi,'O');
								seriesProgress = seriesProgress.replace(/W/gi,'&#10003');
								seriesProgress = seriesProgress.replace(/L/gi,'X');
								flexRank += (`**IN FLEX PROMOS ${seriesProgress}**\n`);
							}
						}
						else if(q.queueType == "RANKED_FLEX_TT"){
							threeRank = (`3v3: ${tier} ${q.rank}, *LP: ${q.leaguePoints}*\n`)
							if(q.miniSeries){
								let seriesLetters = [q.miniSeries.progress[0]];
								for(let i = 1; i < q.miniSeries.progress.length; i++){
									seriesLetters.push('-',q.miniSeries.progress[i]);
								}
								seriesProgress = seriesLetters.join('');
								seriesProgress = seriesProgress.replace(/N/gi,'O');
								seriesProgress = seriesProgress.replace(/W/gi,'&#10003');
								seriesProgress = seriesProgress.replace(/L/gi,'X');
								threeRank += (`**IN TT PROMOS ${seriesProgress}**\n`);
							}
						}
					});

					summonerRank = soloRank + flexRank + threeRank;

					return summonerRank
				}).catch(e =>{
					if(e.status == 404){
						console.log(`Summoner '${summoner}' rank data not available 404.`);
					}
					else if(e.status == 403 || e.status == 429){
						channel.send(`API Key error. See Khaoz. ${e} on get rank data.`);
					}
					else{
						channel.send(`Other or unknown error. See Khaoz. ${e}`);
						console.log(e.stack);
					}
				});;
				//The summonerInfo var is the value that is returned into the embed, so here we set the first value to the summoner spells
				//the second value is also set as the rank (TBD).
				summonerInfo[1] = `${ssData.data[ss1].name}, ${ssData.data[ss2].name}\n`;
				//summonerInfo[0] = `PLACE HOLDER`

				//We begin the second loop, looping through each and every rune the particular summoner has, adding thier name (from ID) and how many of
				//each rune they have, to summonerInfo array.
				for(j = 0; j < body.participants[i].perks.perkIds.length; j++){
					var theRune = body.participants[i].perks.perkIds[j];

					for (k = 0; k < runesData.length; k++){
						if(runesData[k].id == theRune){
							summonerInfo[j+2] = `${runesData[k].name}`;
						}
					}
				}
				summonerInfo[summonerInfo.length] = `\u200B`

				summonerInfo[2] = `**${summonerInfo[2]}**`

				//We then check which team the summoner is on, and addthier data to the corresponding embed.
				if(body.participants[i].teamId == "100") blueembed.addField(summoner, summonerInfo, true);
				if(body.participants[i].teamId == "200") purpembed.addField(summoner, summonerInfo, true);

			}

			if(body.participants.length << 12) blueembed.addField('\u200B', '\u200B', true)
			if(body.participants.length << 12) purpembed.addField('\u200B', '\u200B', true)

			//Once we have looped through for each summoner, we send all the embeds, in order (main game info, purple and finally blue).
			channel.send({embed :gameembed})
			channel.send({embed :purpembed})
			channel.send({embed :blueembed})

		}).catch(e =>{
			if(e.status == 404){
				console.log(`Summoner '${summonerName}' is not currently in a live game.`);
			}
			else if(e.status == 403 || e.status == 429){
				channel.send(`API Key error. See Khaoz. ${e} on get current game data.`);
			}
			else{
				//channel.send(`Other or unknown error. See Khaoz. ${e}`);
				console.log(e.stack);
			}
		});
	}).catch(e =>{
		if(e.status == 404){
			channel.send(`Could not find summoner "**${summonerName}**"`);
		}
		else if(e.status == 403 || e.status == 429){
			channel.send(`API Key error. See Khaoz. ${e} on get ID`);
		}
		else{
			//channel.send(`Other or unknown error. See Khaoz. ${e.status} error.`);
			console.log(e.stack);
		}
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

exports.tick = function(){
    for(var key in bot.guildSettings){
        for(let j = 0; j < bot.guildSettings[key].summonerNames.length; j++){
            if(bot.guildSettings[key].summonerNames[j]){
            	if(bot.guildSettings[key].summonerNames[j].timestamp + timeout <= Date.now()){

	                exports.callApi(bot.guildSettings[key].guildID, bot.guildSettings[key].summonerNames[j].name);
	                bot.guildSettings[key].summonerNames[j].timestamp = Date.now();
	            }
                sleep(10000);
            }
        }
    }
}

function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].name.toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

module.exports.help = {
	name: "lgtest",
	type: "league",
	desc: "Searches for current summoner's game, dispalying stats for summoners in current game.",
	example: "!livegame [summoner name] *or* !livegame add [summoner name] *or* !livegame remove [summoner name]"
}
