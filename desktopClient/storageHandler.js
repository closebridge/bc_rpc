import { existsSync, readFileSync, stat, writeFileSync } from 'fs'

// const crypto = require('crypto')

const fileName = 'bc-config.json'


export async function storageHandler([state, key, value], password) {
    // [state]: [0: write || 1: read || 2: remove]
    // ^^ [0: write:: required key, value] (fn would return true/false)
    // ^^ [0: read:: required key] (fn would return object of the requested key)
    // password: user key for decryption

    let currentJSON = {}

    !existsSync(fileName) ?
        finalWriteToFile() :
        // @ts-ignore
        currentJSON = readFileSync(fileName)

    console.log(currentJSON) // DEBUG

    let readPerRequest = (requestedKey) => { // getkey
        return currentJSON[requestedKey]
    }

    if (state === 0) { // setkey
        currentJSON.key = value
    } else if (state === 2) { // remove
        currentJSON.key = null
    }

    function finalWriteToFile() {
        return writeFileSync(fileName, JSON.stringify(currentJSON))
    }
}
