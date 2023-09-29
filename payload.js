function getEmailQueryParam() {
    const params = new URLSearchParams(window.location.search);
    email = params.get('email');
    if (email == null){
        return "test@email.com"
    } else {
        return email
    }
}

async function getDeviceId() {
    // if device id is in query params then return that
    const params = new URLSearchParams(window.location.search);
    device_id = params.get('device_id');
    if (device_id != null){
        return device_id
    }
    const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
}

function getHostname() {
    if (window.location.hostname != "") {
        return window.location.hostname
    }
    return window.location.href
}

async function sendDataToEndpoint(email, device_id, host) {
    try {
        const base = 'https://europe-west2-nodal-figure-204805.cloudfunctions.net/save-session';
        const queryParams = '?email=' + email + '&device_id=' + device_id + '&host=' + host; 
        const url = base + queryParams;

        const response = await fetch(url);

        const result = await response.json();
        console.log(result);

        if (result.redirect) {
            window.location.href = result.url;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    const queryParam = window.location.search;

    if (queryParam.includes("logout=true")) {
        displayMessage("You have been logged out");
        return
    }
    if (queryParam.includes("popup=true")) {
        displayPopup("It looks like you are sharing your password with a friend. Please create a new account.")
        return
    }
    const email = getEmailQueryParam();
    const deviceId = await getDeviceId();
    const host = getHostname();
    const htmlContent = `
        <h1>You are viewing content as ${email}</h1>
        <h2>Your device id is ${deviceId}</h2>
        <h2>Your host is ${host}</h2>
        <h2>Click <a href='?logout=true'>here</a> to logout</h2>
    `;

    document.write(htmlContent);
    sendDataToEndpoint(email, deviceId, host);

    // setInterval(sendDataToEndpoint, 10000);
    
}

function displayMessage(message) {
    document.write(`<h1>${message}</h1>`);
}

function displayPopup(message) {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.bottom = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.backgroundColor = "red";
    popup.style.color = "white";
    popup.style.padding = "10px";
    popup.style.textAlign = "center";
    popup.innerHTML = message;
    document.body.appendChild(popup);
    // exit button
    const exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit";
    exitButton.style.position = "absolute";
    exitButton.style.top = "0";
    exitButton.style.right = "0";
    exitButton.style.padding = "10px";
    exitButton.style.backgroundColor = "white";
    exitButton.style.color = "red";
    exitButton.style.border = "none";
    exitButton.style.cursor = "pointer";
    exitButton.style.fontSize = "16px";
    exitButton.style.fontWeight = "bold";
    exitButton.style.outline = "none";
    exitButton.onclick = function() {
        popup.style.display = "none";
    }
    popup.appendChild(exitButton);

}

main();
