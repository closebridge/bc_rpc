// import path from "path";
// const { app, BrowserWindow, session, screen, shell } = require("electron");



// export function startLoginPrompt(productionReady, accountType) {

//     let cookieOutput = ''

//     const { width, height } = screen.getPrimaryDisplay().workAreaSize;

//     const window = new BrowserWindow({
//         width: Math.floor(width * 0.3741),
//         height: Math.floor(height * 0.95),
        
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'gui/static/script/preload_loginNoticeBanner.js')
//         },
//     });

//     window.loadURL('https://roblox.com/login');
//     window.webContents.insertCSS(`
//     body {
//         position: static;
//         height: 100vh
//     }

//     #externalLoginBannerParent {
//         width: 100%;
//         position: fixed;
//         bottom: 0;
//         z-index: 9999;
//     }`
//     );

//         return new Promise((resolve, reject) => {
//             window.webContents.on('did-finish-load', async () => {
//             let currentHref = window.webContents.getURL();
//             console.log(currentHref);

//             if (currentHref.toLowerCase() === 'https://www.roblox.com/home') {
//                 changeBannerStat();

//                 setTimeout(async () => {
//                     productionReady || accountType === 2 ? // clear state or temporary login
//                         await session.defaultSession.clearStorageData({ storages: ['cookies'] }) :
//                         false
//                     window.webContents.close();
//                 }, 4000);

//                     try {
//                 const sessionCookies = session.defaultSession.cookies;
//                         const cookies = await sessionCookies.get({});
//                         let existingCookiePretext = [
//                             'GuestData',
//                             'RBXEventTrackerV2',
//                             'rbxas',
//                             'RBXSource',
//                             '.ROBLOSECURITY',
//                             'RBXSessionTracker',
//                             'bm_mi',
//                             'bm_sv',
//                             '_t',
//                             'ak_bmsc',
//                             'UnifiedLoggerSession',
//                         ];

//                         if (
//                             cookies.length === existingCookiePretext.length ||
//                             cookies.length >= existingCookiePretext.length
//                         ) {
//                             const pretextSet = new Set(existingCookiePretext);
//                             for (const key in cookies) {
//                                 const currentKey = cookies[key];
//                                 if (pretextSet.has(currentKey.name)) {
//                                     existingCookiePretext = existingCookiePretext.filter(
//                                         (item) => item !== currentKey.name
//                                     );
//                                 }
//                             }
//                         } else {
//                             reject(new Error('response header integrity failed (not within length)'));
//                         }

//                         cookieOutput = 'rbx-ip2=1;';
//                         cookies.forEach((arr) => {
//                             cookieOutput = `${cookieOutput}${arr.name}=${arr.value};`;
//                         });
//                         // @ts-ignore
//                         localStorage.storageHandler([1, `${accountTypeToText[accountType], cookieOutput}`], null)
//                         resolve(cookieOutput);
//                     } catch (err) {
//                         reject(err);
//                     }
//                 }

//             function changeBannerStat() {
//                 window.webContents.executeJavaScript(`
//                         const extLoginBanner = document.getElementById('externalLoginBannerParent');
//                         const headerText = extLoginBanner.querySelector('#extLBP_headerText');
//                         const underText = extLoginBanner.querySelector('#extLBP_lowerText');
//                         // const img = extLoginBanner.querySelector('#extLBP_img'); // unused

//                         extLoginBanner.style.border = '4px solid rgb(2, 99, 2)';
//                         extLoginBanner.style.bottom = '50%';
//                         extLoginBanner.style.translate = 'translateY(50%)';

//                         headerText.innerText = 'You did it, glad you still remember the password.';
//                         underText.innerText = 'This window will close by itself automatically...';
//                     `);
//                 }
//             });
//         });
//     }

//     app.whenReady().then(() => {
//         startLoginPrompt()
//     });


// function joinRoblox(placeId) {
//     if (placeId && Number.isInteger(placeId) && placeId > 0) {
//         shell.openExternal(`roblox://placeID=${placeId}`);
//         setTimeout(() => { app.quit() }, 600);
//         return true
//     } else {
//         throw new Error('joinRoblox shell failed, placeID: ' + placeId);
//     }
// }

// // joinRoblox(91380951984502)