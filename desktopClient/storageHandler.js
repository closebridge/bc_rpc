import { existsSync, readFileSync, stat, writeFileSync } from 'fs'
import path from 'path';
import process from 'process';
import crypto from 'crypto'


// @ts-ignore
const fileName = path.join(process.env.HOME, 'Documents', 'bc-config.json');

/**
*    @param state: number- 0: read ; 1: write ; 2: remove
*    @param key: string- key of the entry for both read and write
*    @param value: string- writing into selected key
*    @param password: string- user password to decrypt bc-config.json (both read and write)
*    @returns array [state, key, value]
*    @description make change to config file (by default it's `bc-config.json` located in user's Document folder)
*/
export async function storageHandler( { state, key, value }, password) {
    // [state]: [0: read || 1: write || 2: remove] (kinda like permission number in linux)
    // ^^ [0: write:: required key, value] (fn would return true/false)
    // ^^ [0: read:: required key] (fn would return object of the requested key)
    // password: user key for decryption

    let currentJSON = {
        "encryption": {
            "isEnforced": [], // index is 1, know if entry on each key is required to use password
            "publicPGP": '' // public pgp for encrypt/decrypt (require user's password to actually use)
        }, // (why the fuck do anyone need to enforce encryption policy on setting???)
        "local_cred": [], // 0: personal open cloud, 1: personal _ROBLOSECURE, 2: dummy open cloud, 3: discord bot token
        "setting": {
            "ui:darkMode": true,
            "ui:hideAtStartup": true,

            "service:runAtStartup": false,
            "service:updateTiming": 10, // in second

            "notification:allowedNotification": true,
        }
    }

    // console.log(!existsSync(fileName))
    !existsSync(fileName) ?
        finalWriteToFile() :
        // @ts-ignore
        currentJSON = JSON.parse(readFileSync(fileName, 'utf8'));

        console.log(currentJSON) // DEBUG

    let readPerRequest = (requestedKey) => { // getkey
        const finalValue = currentJSON[requestedKey]
        if (finalValue) {
            return finalValue
        } else {
            return false
        } 
    }

    let returns
    if (state === 0) { // read
        returns = await readPerRequest(key)
        .then(val => {
            return val
        }).catch(err => {
            throw new Error('unable to get value, ' + err)
        })
    } else if (state === 1) { // write
        currentJSON.key = value
        finalWriteToFile()
        
    } else if (state === 2) { // remove
        currentJSON.key = null
        finalWriteToFile()
        
    }

    returns = readPerRequest(key)

    function finalWriteToFile() {
        // console.log(currentJSON) // DEBUG
        return writeFileSync(fileName, JSON.stringify(currentJSON))
    }
    return returns
}

// console.log(storageHandler( {state: 1, key: "hallo:D", value: '2' }, null))