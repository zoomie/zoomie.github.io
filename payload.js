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
    const params = new URLSearchParams(window.location.search);
    device_id = params.get('device_id');
    if (device_id != null){
        return device_id
    }
    if (localStorage.getItem('fernDeviceId') != null) {
        return localStorage.getItem('fernDeviceId');
    } else {
        const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('fernDeviceId', deviceId);
        return deviceId;
    }

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
        return result;

    } catch (error) {
        console.error('Error:', error);
    }
}

function displayDemoSiteData(email, deviceId, host) {
    const htmlContent = `
        <h1>You are viewing content as ${email}</h1>
        <h2>Your device id is ${deviceId}</h2>
        <h2>Your host is ${host}</h2>
    `;
    document.body.innerHTML = htmlContent;
}

function displayPopup(message) {
    // Create the popup container
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.width = '300px';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#ffffff';
    popup.style.border = '1px solid #000';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
    popup.style.borderRadius = '5px';
    popup.style.overflow = 'hidden';
    
    // Add message to popup
    var messageElem = document.createElement('p');
    messageElem.textContent = message;
    popup.appendChild(messageElem);

    // Create close button
    var closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = function() {
        document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    // Append popup to body
    document.body.appendChild(popup);
}

async function main() {
    const email = getEmailQueryParam();
    const deviceId = await getDeviceId();
    const host = getHostname();
    displayDemoSiteData(email, deviceId, host);
    result = await sendDataToEndpoint(email, deviceId, host);
    if (result.popup) {
        let message = `
        It looks like you are sharing your password, please not that this is against our terms of service.
        You have ${result.session_count} devices and the limit is ${result.max_devices}.
        `
        displayPopup(message)
    }
}

main();
