import { existsSync, readFileSync, stat, writeFileSync } from 'fs'
import path from 'path';
import process from 'process';
import crypto from 'crypto'


// @ts-ignore
const fileName = path.join(process.env.HOME, 'Documents', 'bc-config.json');

export async function storageHandler([state, key, value], password) {
    // [state]: [0: read || 1: write || 2: remove] (kinda like permission number in linux)
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

    if (state === 0) { // read
        return readPerRequest(key)
    } else if (state === 1) { // write
        currentJSON.key = value
        finalWriteToFile()
    } else if (state === 2) { // remove
        currentJSON.key = null
        finalWriteToFile()
    }

    function finalWriteToFile() {
        console.log(currentJSON) // DEBUG
        return writeFileSync(fileName, JSON.stringify(currentJSON))
    }
    return [state, key, value]
}
