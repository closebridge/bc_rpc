const { existsSync, readFileSync, stat, writeFileSync } = require('fs');
const path = require('path');
const process = require('process');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


// @ts-ignore
const fileName = path.join(process.env.HOME, 'Documents', 'bc-config.json');

/**
 *   make change to config file (by default it's `bc-config.json` located in user's Document folder)
*    @param state: number- 0: read ; 1: write ; 2: remove
*    @param key: string- key of the entry for both read and write
*    @param value: string- writing into selected key
*    @returns array [state, key, value]
*/
async function storageHandler( { state, key, value }, password) {
    // [state]: [0: read || 1: write || 2: remove] (kinda like permission number in linux)
    // ^^ [0: write:: required key, value] (fn would return true/false)
    // ^^ [0: read:: required key] (fn would return object of the requested key)

    throw new Error('feature not ready... yet! (do not use)')

    let currentJSON = {
        security: {
            masterPassword: {
                hash: '', // linked master password, passed as string
                metadata: '', // metadata of the encryption
                isEnforced: true // if value within 'security' is required to encrypt
            },
            credentials: {
                personalOpenCloud: '', // personal open cloud
                personalRobloSecure: '', // personal _ROBLOSECURE
                dummyOpenCloud: '', // dummy open cloud
                discordBotToken: '' // discord bot token
            }
        },
        settings: {
            ui: {
                darkMode: true,
                hideAtStartup: true
            },
            service: {
                runAtStartup: false,
                updateTiming: 600 // in milliseconds
            },
            notification: {
                allowedNotification: true
            },
            worker: {
                onExternalSystem: false
            }
        },
        version: 0
    }

    // console.log(!existsSync(fileName))
    !existsSync(fileName) ? // first time file creation (master password would be linked)
        await firstTimeSetup('admin') : // LOL (yes i know its not ideal, but its temporaily
        // @ts-ignore
        currentJSON = JSON.parse(readFileSync(fileName, 'utf8'));

        console.log(currentJSON) // DEBUG

    const isEnforced = currentJSON.security.masterPassword.isEnforced


    let readPerRequest = async (requestedKey) => { // getkey
        let currentVal = currentJSON[requestedKey]

        if (requestedKey === 'security' && isEnforced) {
            let tempData = Object.entries(currentVal.credentials)
            for (let i = 0; i < tempData.length; i++) {
                tempData[i][1] = await enforceSecurity()
            }
        } 

        if (currentVal) {
            return currentVal
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

    
    
    /**
     * encrypt/decrypt selected storage's key
    *    @param state: number- state of the function (0: encrypt/ 1: decrypt)
    *    @param password: string- master password input
    *    @param data: string- value to went through encryption
    *    @returns false | string
    */
    async function enforceSecurity(state, password, data) {
        if (await verifyMasterPassword(password) === false) {
            throw new Error('master password is incorrect')
        }

        if (state === 0) {
            return encrypt(data, password)
        } else {
            return decrypt(data, password)
        }

        
        function encrypt(text, password) {
            const key = crypto.createHash('sha256').update(password).digest();
            const iv = currentJSON.security.masterPassword.metadata !== '' ? currentJSON.security.masterPassword.metadata : crypto.randomBytes(16);
        
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        
            currentJSON.security.masterPassword.metadata = iv.toString('hex');
            return encrypted.toString('hex')
        }


        function decrypt(encrypted, password) {
            const key = crypto.createHash('sha256').update(password).digest();
            const iv = Buffer.from(currentJSON.security.masterPassword.metadata, 'hex');
            const encryptedText = Buffer.from(encrypted, 'hex');
        
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        
            return decrypted.toString('utf8');
        }
        
    }

    async function verifyMasterPassword(input) {
        return bcrypt.compare(input, currentJSON.security.masterPassword.hash)
    }

    async function firstTimeSetup(master) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(master, salt)

        currentJSON.security.masterPassword.hash = hash
        finalWriteToFile()
    }

    function finalWriteToFile() {
        // console.log(currentJSON) // DEBUG
        return writeFileSync(fileName, JSON.stringify(currentJSON))
    }
    return returns
}

module.exports = storageHandler

// console.log(storageHandler( {state: 1, key: "hallo:D", value: '2' }, null))