window.addEventListener('DOMContentLoaded', () => {
    const absoluteDiv = document.createElement('div');
    const parentLoginBannerDiv = document.createElement('div');

    absoluteDiv.id = 'externalLoginBannerParent';
    absoluteDiv.style.cssText = `
        width: 100%; 
        position: fixed; 
        bottom: 0; 
        right: 50%; 
        transform: translate(51vw, -5%);
        transition: all 200ms ease-in-out;
    `;

    parentLoginBannerDiv.style.cssText = `
        width: 95%; 
        border-radius: 20px; 
        display: flex; 
        justify-content: space-evenly; 
        align-items: center; 
        padding: 3px 0 5px 0;
        background: rgba(107, 107, 107, 0.27);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5.3px);
        -webkit-backdrop-filter: blur(5.3px);
        border: 1px solid rgba(107, 107, 107, 0.3);
    `;

    const textDiv = document.createElement('div');
    textDiv.style.cssText = `
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
        color: #222222; 
        padding: 0 0 2px 3px; 
        align-items: center;
    `;
    textDiv.innerHTML = `
        <p id="extLBP_headerText">Proceed to login normally, then we will handle the rest! (Don't worry, I'll wait)</p>
        <span id="extLBP_lowerText" style="font-weight: 100; font-size: small; color: rgb(134, 134, 134);">
            pinky promise, your login credentials would be save LOCALLY and ENCRYPTED. 
            (becuz nokotan said shes not interested in ur 5 bubx account)
        </span>
    `;

    const image = document.createElement('img');
    image.id = 'extLBP_img';
    image.src = 'https://tr.rbxcdn.com/180DAY-04482df59040f1e244144a2bfc11d8ee/150/150/Decal/Webp/noFilter';
    image.alt = 'me waite';
    image.style.cssText = `
        width: 35%; 
        padding: 4px; 
        border-radius: 23px; 
        user-select: none; 
        object-fit: scale-down;
    `;
    image.draggable = false;

    parentLoginBannerDiv.appendChild(textDiv);
    parentLoginBannerDiv.appendChild(image);

    absoluteDiv.appendChild(parentLoginBannerDiv);

    document.body.appendChild(absoluteDiv);
});