const { default: axios } = require("axios");

const robloxGatewayURL = "https://apis.roblox.com/cloud/v2"
const requestTimingRate = 3000
const preHeader = axios.create({
    headers: {
        "x-api-key": process.env.PERSONAL_OPENAPI
    }
})


async function establishDiscordConnection(userId, discordToken) {
    return true;
}

async function getRobloxPlayer(personalId, dummyId) {
    const idArgs = [personalId, dummyId]
    idArgs.forEach(e => {
        let url
        setTimeout(() => {
            url = `${robloxGatewayURL}/users/${idArgs}`

        }, requestTimingRate);
    });
}

async function getRobloxPlace(universeId, placeId) {
    const url = `${robloxGatewayURL}/universes/${universeId}/places/${placeId}`
    return [universeId, placeId];
}
2
async function checkForProfanity(input) {
    axios.get('https://vector.profanity.dev', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        params: {"body": input}
    }).then(truu => {
        if (truu.data.isProfanity) {

        } else {
            return [true, input]
        }
    }, falss => {
        throw new Error('profanity api rejected request')
    })

    return [true, ''];
}

async function __init__([discordUserId, robloxPersonalUserId, robloxDummyId], [discordToken], [robloxExperienceId]) 
    {
    if ( // ugly, but it gets the job done
        typeof discordUserId !== 'number' &&
        typeof robloxPersonalUserId !== 'number' &&
        typeof robloxDummyId !== 'number' &&
        typeof discordToken !== 'string' &&
        typeof robloxExperienceId !== 'number'
    ) {
        throw new Error("one or more input has incorrect type, please check!");
    }
    // when making http request, please include "x-api-key" as {process.env.PERSONAL_OPENAPI} in headers for authorization

    if (await getRobloxPlace(robloxExperienceId) && await getRobloxPlayer(robloxPersonalUserId, robloxDummyId))

    // verify each arguments' type (check)
    // verify each arguments' validity using API
    // check if user has joined the designated experience
    // long polling (establish connection to experience)
    // establish connection to user's Discord (for activities), returns change once updated 
    // process each activities (music, game, screen sharing, custom rpc...)
    // send to profanity checker (censor if needed)
    // send out processed data to dummy's experience description
    // send out update to place's name in experience (2 total, take turns for each activities)
    // use TeleportService to send player to the new updated place
}

// console.log(getRobloxPlace(1, 2))
console.log(process.env.PERSONAL_OPENAPI);
