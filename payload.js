
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
console.log("hostname:", getHostname());

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
    } else {
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
    }

    // setInterval(sendDataToEndpoint, 10000);
}

function displayMessage(message) {
    document.write(`<h1>${message}</h1>`);
}

main();
