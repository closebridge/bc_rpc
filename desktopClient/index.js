const { default: axios, create, Axios } = require("axios");
// const { error } = require("console");
// const { createReadStream } = require("fs");
const { app, BrowserWindow, session, screen, shell } = require("electron");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
// const wanakana = require('wanakana'); // BABABABABA SHAME ON YOU @ROBLOX


const { Client, Events, GatewayIntentBits } = require("discord.js")


const localStorage = require('./storageHandler') // not usable!
// const startDiscordGateway = require('./discordHandler');
const storageHandler = require("./storageHandler");
const productionReady = false

const robloxGatewayURL = "https://apis.roblox.com/cloud/v2"
const requestTimingRate = 3000
const placeIds = {'universeId': '7864197053', 'placeId': '91380951984502'}

const preHeader = axios.create({
    headers: {
        "x-api-key": process.env.PERSONAL_OPENAPI
    }
})

let personalOCCredential, personal_ROBLOSECURITYCredential, dummyOCCredential, discordBotToken;


async function fillCredential() {
    
    // console.log(process.env.PERSONAL_OPENAPI)
    const getCredential = async (key, envVar) => 
        !productionReady ? 
        process.env[envVar] 
        : JSON.parse(await storageHandler({ state: 0, key: 'local_cred', value: false }, null))[key];

    try {
        personalOCCredential = await getCredential(0, 'PERSONAL_OPENAPI');
        personal_ROBLOSECURITYCredential = await getCredential(1, 'PERSONAL_COOKIE');
        dummyOCCredential = await getCredential(2, 'DUMMY_OPENAPI');
        discordBotToken = await getCredential(3, 'BOT_TOKEN');

        if (![personalOCCredential, personal_ROBLOSECURITYCredential, dummyOCCredential, discordBotToken].every(Boolean)) {
            throw new Error('unable to pull credentials');
        }
    } catch (error) {
        console.error('Error filling credentials:', error);
        throw error;
    }
    return true;
}

// (async () => {
//     await fillCredential();
//     console.log(personalOCCredential, dummyOCCredential);
// })();



function randomString(length) { // shamelessly stolen off stackoverflow (xoxo @ csharptest.net and tylerh)
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function getRobloxPlayer(personalId, dummyId) {
    const idArgs = [personalId, dummyId];
    return idArgs.map(e => {
        let url;

        setTimeout(() => {}, requestTimingRate);
        
        if (e) {
            url = `${robloxGatewayURL}/users/${e}`;
            preHeader.get(url, {
                method: 'GET'
            })
            .then(data => {
                console.log(data.data)
            })
            return e;
        }        
    });
}

// getRobloxPlayer(126722907, false)


// async function checkRobloxUniverse(universeId, placeId, miscellaneous) {
// // misc arg: [title, body, close/open]
//     let url = ''

//     // if (universeId && placeId) {
//     //     url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}`;
//     // } else if (universeId && !placeId) {
//     //     url = `${robloxGatewayURL}/universes/${universeId}`;
//     // } else if (setting === 1) {
//     //     url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}/versions?versionType="Published"`;}
//     if (!universeId && placeId) {
//         throw new Error("universeId is empty!");
//     }
// }
// checkRobloxUniverse(6708394684, 122757165339913, 2, ['sick open cloud gng', "hello world!"])

/**
*    @see {@link https://create.roblox.com/docs/cloud/reference/Place#Cloud_UpdatePlace}
*    @param placeId: number- selected place id to make changes to
*    @param userType: number- type of user to make change (0: personal ; 1: dummy account)
*    
*    ^ behaviour change with different type (0: direct change into main title ; 1: make change to description with newline)
*
*    @param value: string- the text value that would be changed
*    @returns boolean- based on open cloud action
*/
async function changePlaceData({universeId, placeId}, userType, value) {
    if (
        !Number.isInteger(universeId) && universeId < 0 &&
        !Number.isInteger(placeId) && placeId < 0 &&
        !Number.isInteger(userType) && userType < 0 &&
        typeof value !== 'string'
    ) {return false}


    switch (userType) {
        case 0: // personal (make changes directly to user's place) (MUST SANITIZED PROPERLY)
            // const csrfToken = await preHeader.get('https://create.roblox.com/', {
            //     headers: {
            //         "x-api-key": personalOCCredential,
            //     }
            // })
            // .then(res => console.log(res.headers))
            // // .then(res => res.headers['x-csrf-token'])
            // .catch(err => { throw new Error("Error fetching CSRF token: " + err) })

            const seperateAxiosRequestSinceIveNoIdeaHowItHappened = axios.create({
                headers: {
                    'x-api-key': personalOCCredential,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'patch',
                url: `${robloxGatewayURL}/universes/${universeId}/places/${placeId}`,
            })

            // const finalValue = (val) => {
            //     let final
            //     if (wanakana.isJapanese(val)) {
            //         final = wanakana.toRomaji(val)
            //     } else {
            //         final = val
            //     }
            //     return val
            // }

            
            // console.log(finalValue())
            return seperateAxiosRequestSinceIveNoIdeaHowItHappened.patch(`${robloxGatewayURL}/universes/${universeId}/places/${placeId}`, {
                "path": `universes/${universeId}/places/${placeId}`,
                "displayName": value, // the value is here!
                "description": 'hi',
                "serverSize": 1
            })
            .then(res => {
                console.log(res.status, res.statusText)
                // res.data
            })
            .catch(err => { throw new Error("Error in changing displayName of place:" + err.response.statusText)});
        case 1: // dummy (make change into dummy's place description with \n)
            const newlineValue = async() => { // split, newline for each text (return string)
                let a = ''
                value.split(' ').forEach(val => {
                    a += `${val}\u000A`
                });
                return a;
            }
            return axios.patch(`${robloxGatewayURL}/universes/${universeId}/places/${placeId}`,{
                "path": `universes/${universeId}/places/${placeId}`,
                "displayName": 'nil',
                "description": await newlineValue(),
                "serverSize": 1
            },
                {headers: {
                    "x-api-key": dummyOCCredential,
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.data)
            .catch(err => { throw new Error("Error in changing description of place:" + err) })
    }   
}
// (async () => {
//     // console.log('wait0')
//     await fillCredential();
//     // console.log('WAIT1')
//     changePlaceData({universeId: 7864197053, placeId:91380951984502}, 0, 'hallo guis :D')
// })();

async function notStealingUsersRobloxCredential(accountType) {
    //accountType = 0: personal account; 1: dummy account; 2: temporary login
    const accountTypeToText = {0: 'personal account', 1: 'dummy account', 2: 'temporary login'}
    let cookieOutput = ''

    
    function startLoginPrompt() {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        const window = new BrowserWindow({
            width: Math.floor(width * 0.3741),
            height: Math.floor(height * 0.95),
            
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'gui/static/script/preload_loginNoticeBanner.js')
            },
        });

        window.loadURL('https://roblox.com/login');
        window.webContents.insertCSS(`
        body {
            position: static;
            height: 100vh
        }

        #externalLoginBannerParent {
            width: 100%;
            position: fixed;
            bottom: 0;
            z-index: 9999;
        }`
        );

        return new Promise((resolve, reject) => {
            window.webContents.on('did-finish-load', async () => {
            let currentHref = window.webContents.getURL();
            console.log(currentHref);

            if (currentHref.toLowerCase() === 'https://www.roblox.com/home') {
                changeBannerStat();

                setTimeout(async () => {
                    productionReady || accountType === 2 ? // clear state or temporary login
                        await session.defaultSession.clearStorageData({ storages: ['cookies'] }) :
                        false
                    window.webContents.close();
                }, 4000);

                    try {
                const sessionCookies = session.defaultSession.cookies;
                        const cookies = await sessionCookies.get({});
                        let existingCookiePretext = [
                            'GuestData',
                            'RBXEventTrackerV2',
                            'rbxas',
                            'RBXSource',
                            '.ROBLOSECURITY',
                            'RBXSessionTracker',
                            'bm_mi',
                            'bm_sv',
                            '_t',
                            'ak_bmsc',
                            'UnifiedLoggerSession',
                        ];

                        if (
                            cookies.length === existingCookiePretext.length ||
                            cookies.length >= existingCookiePretext.length
                        ) {
                            const pretextSet = new Set(existingCookiePretext);
                            for (const key in cookies) {
                                const currentKey = cookies[key];
                                if (pretextSet.has(currentKey.name)) {
                                    existingCookiePretext = existingCookiePretext.filter(
                                        (item) => item !== currentKey.name
                                    );
                                }
                            }
                        } else {
                            reject(new Error('response header integrity failed (not within length)'));
                        }

                        cookieOutput = 'rbx-ip2=1;';
                        cookies.forEach((arr) => {
                            cookieOutput = `${cookieOutput}${arr.name}=${arr.value};`;
                        });
                        // @ts-ignore
                        localStorage.storageHandler([1, `${accountTypeToText[accountType], cookieOutput}`], null)
                        resolve(cookieOutput);
                    } catch (err) {
                        reject(err);
                    }
                }

            function changeBannerStat() {
                window.webContents.executeJavaScript(`
                        const extLoginBanner = document.getElementById('externalLoginBannerParent');
                        const headerText = extLoginBanner.querySelector('#extLBP_headerText');
                        const underText = extLoginBanner.querySelector('#extLBP_lowerText');
                        // const img = extLoginBanner.querySelector('#extLBP_img'); // unused

                        extLoginBanner.style.border = '4px solid rgb(2, 99, 2)';
                        extLoginBanner.style.bottom = '50%';
                        extLoginBanner.style.translate = 'translateY(50%)';

                        headerText.innerText = 'You did it, glad you still remember the password.';
                        underText.innerText = 'This window will close by itself automatically...';
                    `);
                }
            });
        });
    }

    app.whenReady().then(() => {
        startLoginPrompt()
    });
}

// notStealingUsersRobloxCredential(0)



async function createAPIKey(cookie, placeId, type) { // returns as [boolean, apikeySecret]
    const requestAPI = {
        "cloudAuthUserConfiguredProperties":{
            "name": `${randomString(4)}bloxC`,
            "description": "bloxC's required api, nutch:3",
            "isEnabled": true,
            "allowedCidrs":['0.0.0.0/0'],
            "scopes":[{
                "operations":["write"],
                "scopeType": "universe",
                "targetParts":[`${placeId}`]
            },
            {
                "operations": ["write"],
                "scopeType":"universe.place",
                "targetParts": [`${placeId}`]
            }]
        }
    }
    
    axios.post('https://apis.roblox.com/cloud-authentication/v1/apiKey', requestAPI, {
        headers: {
            "content-type": "application/json",
            // @ts-ignore
            "Cookie": cookie,
            "origin": "https://create.roblox.com/",
            "priority": "u=1, i",
            "referer": "https://create.roblox.com/",
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            "sec-ch-ua": `Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24`,
            'x-csrf-token': 'OXdltcU8/wsm' // TODO: make this dynamic (maybe create a GET call to create.roblox.com and scrape one?)
        }
    }).then(res => {
        // console.log(res.data)
        // console.log(res.status)
        return [res.status, res.data.apikeySecret]
    }).catch(err => {
        throw new Error('error at createAPIKey: ' + err)
    })
}

// const createApiKeyTemp = process.env.PERSONAL_COOKIE;
// console.log(createApiKeyTemp)

// createAPIKey(createApiKeyTemp, 6830936784, true)


// extremely sensitive area, please dont stupidly put your credential in here when commiting, future me.
async function checkIfWithinTheDesignatedExperience(experienceId, robloxPersonalUserId) {

    // TODO: make login attempt using axios with needed headers, then capture Cookies from there
    // ^^^ so change of plan, we can both summon a roblox.com login page window, let user logon (also solve captcha), and we will store credentials from there; or scrapping credentials from browser's cookie (as its own function called notStealingUsersRobloxCredential (pun))
    // (or for now, we store cookie in .env, call them, and craft them later on...)

    

    let finalStat = false
    axios.post('https://presence.roblox.com/v1/presence/users', {"userIds": [robloxPersonalUserId]},{
        headers: {
            "content-type": "application/json",
            // @ts-ignore
            "Cookie": cookii,
            // "Cookie": "// consult to 'v1:presence Cookie header properties' file for brief",
            "origin": "https://www.roblox.com",
            "priority": "u=1, i",
            "referer": "https://www.roblox.com/",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        }
    }).then(res => {
        console.log(res.data)
        if (res.status === 200) {
            console.log(res.data)
            if (res.data.userPresences[0].universeId === experienceId) {
                console.log('user is within the designated experience!')
            } else {
                console.error(`
                    users is not in the designated experience/universe. please double check!\n
                    lastLocation: ${res.data.userPresences[0].lastLocation}`
                );
            }
        }
        finalStat = res.data.userPresences[0].universeId === experienceId
    }).catch(err => {
        throw new Error("error at presence.roblox.com: " + err);
    })
    return finalStat
}

// checkIfWithinTheDesignatedExperience(6830936784, 126722907)


async function checkForProfanity(message) { // true if usable, false if flagged [boolean, message/flagged]
    try {
        const response = await axios.post('https://vector.profanity.dev', JSON.stringify({ message }), {
            headers: { 'Content-Type': 'application/json' }
        });
        // if (response.data.isProfanity) {
        //     return [false, response.data.flaggedFor];
        // } else {
        //     return [true, message];
        // }
        return [response.data.isProfanity, response.data.flaggedFor]
    } catch (error) {
        console.error("error checking profanity:", error);
        return [null, null];
    }
}
// checkForProfanity('example message').then(result => console.log(result))


// ==== DISCORD.JS RELATED AREA (ACTIVITY SCRAPE) START ==== 

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
	return await currentActivity();
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
	let finalOutput = {} // json
	// console.log(activities)
	if (!activities) {
		// console.log('user is not playing anything')
	} else {
		finalOutput = {}
		// console.log('user is playing something')
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
	}
	return finalOutput
}


// @ts-ignore
let debounceTiming = Date.now()
const typePretext = ['Playing', 'Streaming', 'Listening to', 'Watching']
client.on('presenceUpdate', async (oldActivity, newActivity) => {
    let activityData
	if (newActivity.userId === targetMemberId && debounceTiming + 300 <= Date.now() ) {
        let finalRPC = ''
		activityData = await currentActivity()
        // console.log(activityData[1])
        // console.log(Object.keys(activityData).length)
        // return
        for (const key in activityData) {
            if (activityData.hasOwnProperty(key)) {
                // console.log(activityData[key].type); break
                if (activityData[key].type == 4) {false}
                else if (activityData[key].type === 2) { // listening to (spotify 100%)
                    finalRPC += activityData[key].data[0] === "Spotify" ? `${typePretext[activityData[key].type]} ${activityData[key].data[1]} on "Sptfy"` : `${typePretext[activityData[key].type]} ${activityData[key].data[1]} on ${activityData[key].data[0]}`
                } else {
                    finalRPC += `${typePretext[activityData[key].type]} ${activityData[key].data[1]}`
                }
            }
        }
        console.log(finalRPC)
        
        checkForProfanity('example message') // [response.data.isProfanity, response.data.flaggedFor]
        .then(result => {
            console.log(result)
            if (result[0] == true) {
                console.error('profanity catched, since its 3am right now, i dont want to deal anything, and i want to have a proof of concept asap so ill return -1 so the pushToRoblox wont do anything')
                finalRPC = ''
            }
        })


        if (finalRPC) {
            await changePlaceData({universeId: 7864197053, placeId:91380951984502}, 0, finalRPC)
            joinRoblox(Number(placeIds.placeId))
        }

        debounceTiming = Date.now()

		// console.log(activityData)
	}
})


const startDiscordGateway = async () => {
    await client.login(botTokenAPI);
    return await currentActivity();
};

// ==== DISCORD.JS RELATED AREA (ACTIVITY SCRAPE) END ==== 


function joinRoblox(placeId) {
    if (placeId && Number.isInteger(placeId) && placeId > 0) {
        shell.openExternal(`roblox://placeID=${placeId}`);
        // setTimeout(() => { app.quit() }, 600);
        return true
    } else {
        throw new Error('joinRoblox shell failed, placeID: ' + placeId);
    }
}

// joinRoblox(91380951984502)


async function initializeFeature([discordUserId, robloxPersonalUserId, robloxDummyId], [discordToken], [robloxExperienceId]) {
    console.log('running')
    // hydrate credentials from localstorage
    if (await fillCredential()) {
        // joinRoblox(Number(placeIds.placeId))
        let userActivities = startDiscordGateway()
        // console.log(userActivities)
    }

    // check for each value
    // if (![personalOCCredential, personal_ROBLOSECURITYCredential, dummyOCCredential, discordBotToken, placeIds.placeId, placeIds.universeId].every(Boolean)) {
    //     console.error('data(s) integrity wee-a-bit-doozy, please check!')
    //     return false
    // }

    // join place

    // run discord gateway to catch activities
    
    
};

initializeFeature([1, 1, 1], [1], [1]);
(async() => { 
    console.log('hi');
})

// when making http request, please include "x-api-key" as {process.env.PERSONAL_OPENAPI} in headers for authorization

// verify each arguments' (users, experience) type ++++++
// verify each arguments' (users, experience) validity using API ++++++
// check if user has joined the designated experience ++++++
// add login feature for user (personal account, dummy account) ++++++
// create api key for dummy account ++++++
// ^^^ encrypt and save locally with json (wait until a poc is done)
// send to profanity checker (censor if needed) ++++++
// establish connection to user's Discord (for activities), returns change once updated ++++++
// process each activities (music, game, screen sharing, custom rpc...) ++++++
// send out processed data to dummy's experience description
// send out update to place's name in experience (directly on start place)
// use associated URL "roblox://placeID=XXXXXX" for sending player around places

// TODO:
// add check if experience/universe's creator is the same as "robloxPersonalUserId"
// add warning if experience's serverSize is more than 1 && not privated
// store, encrypt saved credential using user-held password?
// console.log(getRobloxPlace(1, 2))
// console.log(process.env.PERSONAL_OPENAPI);

// discordGateway.default()