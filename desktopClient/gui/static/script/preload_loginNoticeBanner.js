window.addEventListener('DOMContentLoaded', () => {
    const absoluteDiv = document.createElement('div')
    const parentDiv = document.createElement('div')

    absoluteDiv.id = 'externalPreloadBannerNotification'

    absoluteDiv.style.cssText = 'width: 100%; position: fixed; bottom: 0; padding: 6px 6px 6px 6px'

    parentDiv.style.cssText = `
        width: 100%; 
        border-radius: 20px; 
        display: flex; 
        justify-content: space-evenly;
        align-content: center;
        padding: 3px 0 5px 0;
        background: rgba(107, 107, 107, 0.27);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5.3px);
        -webkit-backdrop-filter: blur(5.3px);
        border: 1px solid rgba(107, 107, 107, 0.3);
    `;

    const textDiv = document.createElement('div')
    textDiv.style.cssText = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        color: rgb(107, 107, 107); 
        padding: 0 0 2px 3px;
    `;
    textDiv.innerHTML = `
        <p>Proceed to login as you do on normal browser, then the rest is handled by dark magic! (Don't worry, I'll wait)</p>
        <span style="font-weight: 100; font-size: small">
            pinky promise, your login credentials would be save LOCALLY and ENCRYPTED 
            <span style="font-size: x-small; font-weight: lighter; color: rgb(107, 107, 107);">
                (becuz nokotan said shes not interested in ur 5 bubx account)
            </span>
        </span>
    `;

    const image = document.createElement('img')
    // this is stupid... CSP even with image blob...
    image.src = 'https://tr.rbxcdn.com/180DAY-04482df59040f1e244144a2bfc11d8ee/150/150/Decal/Webp/noFilter'
    image.alt = 'me waite'
    image.style.cssText = `
        width: 35%; 
        padding: 4px 4px 4px 4px; 
        border-radius: 22px; 
        user-select: none;
    `;
    image.draggable = false;

    parentDiv.appendChild(textDiv)
    parentDiv.appendChild(image)

    absoluteDiv.appendChild(parentDiv)

    document.body.appendChild(absoluteDiv)
});