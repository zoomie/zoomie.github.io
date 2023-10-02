function getEmail() {
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
    }  
    try {
        const FingerprintJS = await import('https://openfpcdn.io/fingerprintjs/v4');
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
    } catch (error) {
        console.log(error);
        deviceId = crypto.randomUUID()

    }
    localStorage.setItem('fernDeviceId', deviceId);
    return deviceId;
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

function displayIframePopup(message) {
    // Create the iframe container
    var iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '340px';
    iframe.style.height = '160px';
    iframe.style.border = 'none';
    iframe.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.3)'; // Enhancing the shadow for clarity
    iframe.style.borderRadius = '5px';
    iframe.style.overflow = 'hidden';

    // Append iframe to body first so we can manipulate its content
    document.body.appendChild(iframe);

    iframe.onload = function() {
        var iframeDoc = iframe.contentWindow.document;

        // Add CSS to iframe's document
        var style = iframeDoc.createElement('style');
        style.textContent = `
            body { background-color: #f5f5f5; padding: 20px; margin: 0; font-family: Helvetica, Arial, sans-serif; }
            p { color: #000; margin-right: 50px; }
            button { margin-top: 0px; }
            footer { position: absolute; bottom: 5px; right: 10px; font-size: 10px; color: #000; }
        `;
        style.textContent += `
        #closeButton {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 11px;
            cursor: pointer;
            outline: none;
            padding: 0px 7px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);  // Added drop shadow
        }
    `;
        iframeDoc.head.appendChild(style);

        // Add message to iframe
        var messageElem = iframeDoc.createElement('p');
        messageElem.innerHTML = message;
        iframeDoc.body.appendChild(messageElem);

        // Create close button inside iframe
        var closeButton = iframeDoc.createElement('button');
        closeButton.id = 'closeButton';
        closeButton.textContent = 'close'; 
        closeButton.onclick = function() {
            document.body.removeChild(iframe);
        };
        iframeDoc.body.appendChild(closeButton);

        // Add "Powered by fern" text
        var footer = iframeDoc.createElement('footer');
        footer.textContent = 'Powered by fern';
        iframeDoc.body.appendChild(footer);
    };
}

async function main() {
    const email = getEmail();
    const deviceId = await getDeviceId();
    const host = getHostname();
    displayDemoSiteData(email, deviceId, host);
    result = await sendDataToEndpoint(email, deviceId, host);
    if (result.popup) {
        let message = `
        Please note, sharing passwords is against our 
        <a href="https://fern.com/new-account" target="_blank">terms of service</a>.<br><br>
        If you are, please create a 
        <a href="https://fern.com/new-account" target="_blank">new account</a>
        or 
        <a href="https://fern.com/new-account" target="_blank">change your password.</a><br><br>
        Debug: devices=${result.session_count}, limit=${result.max_devices}.
        `
        displayIframePopup(message)
    }
}

main();
