const { default: axios } = require("axios");
const { error } = require("console");
const { createReadStream } = require("fs");

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

checkRobloxUniverse(6708394684, 122757165339913, 2, ['sick open cloud gng', "hello world!"])

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

    if ((await checkRobloxUniverse(robloxExperienceId)).length > 0 
    && (await getRobloxPlayer(robloxPersonalUserId, robloxDummyId)).length > 0) {
        return true
    }

    // verify each arguments' (users, experience) type (check)
    // verify each arguments' (users, experience) validity using API
    // check if user has joined the designated experience
    // long polling (establish connection to experience)
    // establish connection to user's Discord (for activities), returns change once updated 
    // process each activities (music, game, screen sharing, custom rpc...)
    // send to profanity checker (censor if needed) (check)
    // send out processed data to dummy's experience description
    // send out update to place's name in experience (2 total, take turns for each activities (TAKE TURN AS IN RENAME UNUSED ONE))
    // use TeleportService to send player to the new updated place

    // TODO:
    // add check if experience/universe's creator is the same as "robloxPersonalUserId"
    // add warning if experience's serverSize is more than 1 && not privated
}
// console.log(getRobloxPlace(1, 2))
// console.log(process.env.PERSONAL_OPENAPI);
