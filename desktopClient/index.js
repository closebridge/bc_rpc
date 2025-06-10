const { default: axios } = require("axios");
const { error } = require("console");
const { createReadStream } = require("fs");
const { app, BrowserWindow, session, screen } = require("electron");
const path = require("path");

const robloxGatewayURL = "https://apis.roblox.com/cloud/v2"
const requestTimingRate = 3000
const placeIds = [122757165339913, 8692096522]
const preHeader = axios.create({
    headers: {
        "x-api-key": process.env.PERSONAL_OPENAPI
    }
})


async function establishDiscordConnection(userId, discordToken) {
    return true;
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


async function checkRobloxUniverse(universeId, placeId, setting, miscellaneous) {
// setting arg: 0: check, 1: create, 2. update, 3. delete
// misc arg: [title, body, close/open]
    let url = ''

    // if (universeId && placeId) {
    //     url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}`;
    // } else if (universeId && !placeId) {
    //     url = `${robloxGatewayURL}/universes/${universeId}`;
    // } else if (setting === 1) {
    //     url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}/versions?versionType="Published"`;}
    if (!universeId && placeId) {
        throw new Error("universeId is empty!");
    }

    switch (setting) {
        case 0: preHeader.get(url)
                return
        case 1: let rblxPlace = createReadStream('./robloxPlace/startPlace.rbxl')
                preHeader.post(url, rblxPlace, {
                    headers: {'Content-Type': 'Content-Type: application/xml'},
                    // params: {"universeId": universeId, 'placeId': placeId, }
                })
                return
        case 2: url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}`
                preHeader.patch(url, {
                    "path": `universes/${universeId}/places/${placeId}`,
                    "displayName": miscellaneous[0],
                    "description": miscellaneous[1],
                    "serverSize": 1
                })
                .then(res => {console.log(res.status)})
                return

        case 3: preHeader.patch(url)
                return

    }
}
// checkRobloxUniverse(6708394684, 122757165339913, 2, ['sick open cloud gng', "hello world!"])


async function notStealingUsersRobloxCredential(type) {
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

        window.loadURL('https://roblox.com');
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

                setTimeout(() => {
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
                        underText.innerText = 'This window will close by itself after processing...';
                    `);
                }
            });
        });
    }

    return await startLoginPrompt();
}

// app.whenReady().then(async () => {
//     try {
//         const cookies = await notStealingUsersRobloxCredential(false);
//         console.log(cookies); // Should now log the correct cookie output
//     } catch (err) {
//         console.error('Error:', err);
//     }
// });


// extremely sensitive area, please dont stupidly put your credential in here when commiting, future me.
async function checkIfWithinTheDesignatedExperience(experienceId, robloxPersonalUserId) {

    // TODO: make login attempt using axios with needed headers, then capture Cookies from there
    // ^^^ so change of plan, we can both summon a roblox.com login page window, let user logon (also solve captcha), and we will store credentials from there; or scrapping credentials from browser's cookie (as its own function called notStealingUsersRobloxCredential (pun))
    // (or for now, we store cookie in .env, call them, and craft them later on...)

    let cookii = await app.whenReady().then(async () => {
        try {
            const cookies = await notStealingUsersRobloxCredential(false);
            return cookies
        } catch (err) {
            console.error('error at collecting cookie', err);
        }
    });

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
            if (res.data.universeId === experienceId) {
                return true
            } else {
                console.error(`
                    users is not in the designated experience/universe. please double check!\n
                    lastLocation: ${res.data.userPresences[0].lastLocation}`
                );
            }
        }
    }).catch(err => {
        throw new Error("error at presence.roblox.com: " + err);
    })
}

checkIfWithinTheDesignatedExperience(12345678, 126722907)


async function checkForProfanity(message) { // true if usable, false if flagged [boolean, message/flagged]
    try {
        const response = await axios.post('https://vector.profanity.dev', JSON.stringify({ message }), {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.data.isProfanity) {
            return [false, response.data.flaggedFor];
        } else {
            return [true, message];
        }
    } catch (error) {
        console.error("error checking profanity:", error);
        return [null, null];
    }
}
// checkForProfanity('example message').then(result => console.log(result))

async function __init__([discordUserId, robloxPersonalUserId, robloxDummyId], [discordToken], [robloxExperienceId]) 
    {
    if ( // ugly, but it gets the job done
        typeof discordUserId !== 'number' &&
        typeof robloxPersonalUserId !== 'number' &&
        typeof robloxDummyId !== 'number' &&
        typeof discordToken !== 'string' &&
        typeof robloxExperienceId !== 'number'
    ) {
        throw new Error("one or more message has incorrect type, please check!");
    }
    // when making http request, please include "x-api-key" as {process.env.PERSONAL_OPENAPI} in headers for authorization

    // if ((await checkRobloxUniverse(robloxExperienceId)).length > 0 
    // && (await getRobloxPlayer(robloxPersonalUserId, robloxDummyId)).length > 0) {
    //     return true
    // }

    // verify each arguments' (users, experience) type ++++++
    // verify each arguments' (users, experience) validity using API ++++++
    // check if user has joined the designated experience
    // long polling (establish connection to experience)
    // establish connection to user's Discord (for activities), returns change once updated 
    // process each activities (music, game, screen sharing, custom rpc...)
    // send to profanity checker (censor if needed) ++++++
    // send out processed data to dummy's experience description
    // send out update to place's name in experience (2 total, take turns for each activities (TAKE TURN AS IN RENAME UNUSED ONE))
    // use TeleportService to send player to the new updated place

    // TODO:
    // add check if experience/universe's creator is the same as "robloxPersonalUserId"
    // add warning if experience's serverSize is more than 1 && not privated
    // store, encrypt saved credential using user-held password?
}
// console.log(getRobloxPlace(1, 2))
// console.log(process.env.PERSONAL_OPENAPI);
