import axios from "axios";
// import ws from "ws" // "Don't reinvent the wheel -Anthony J. D'Angelo..."
import { Client, Events, GatewayIntentBits, Guild } from "discord.js"


const botTokenAPI = process.env.BOT_TOKEN
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildPresences] 
})
const targetMemberId = "363479095503355904"; // me
const sharedServerId = "968463808039383070" // current server that bot and user is within

client.once(Events.ClientReady, async readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	console.log(await currentActivity());
});

let currentActivity = async() => {
	let sharedServer
	let user
	try {
		sharedServer = await client.guilds.fetch(sharedServerId)
	} catch (error) {
		throw new Error("server's ID is incorrect")
	}


	try {
		user = await sharedServer.members.fetch(targetMemberId)
		// console.log(user)
	} catch (error) {
		throw new Error("user's ID is incorrect")
	}

	// @ts-ignore
	const activities = user.presence?.activities;
	// console.log(activities)
	if (!activities) {
		console.log('user is not playing anything')
	} else {
		let finalOutput = {} // json
		// {type: number, name: string [largeText, smallText, details, state]}
		// console.log(`${activities}, ${activities.length}, ${activities[0].type}` )
		// return false
		for (let i = 0; i < activities.length; i++) {
			
			// 	case 0: // playing something
			// 	case 1: // streaming
			// 	case 2: // listening
			// 	case 3: // watching
			// 	case 4: // you tell me (custom)

			if (activities[i]) {
				const item = {[i]: {
					type: activities[i]['type'],
					data: [
						activities[i]['name'],
						activities[i]?.assets?.largeText || null,
						activities[i]?.assets?.smallText || null,
						activities[i]?.details || null
					]
				}}
			Object.assign(finalOutput, item)
			}
		};
		return finalOutput
	}
}


// @ts-ignore
client.on('presenceUpdate', async (oldActivity, newActivity) => {
	if (newActivity.userId === targetMemberId) {
		console.log(await currentActivity())
	}
})

const startDiscordGateway = () => client.login(botTokenAPI)
export default startDiscordGateway;
