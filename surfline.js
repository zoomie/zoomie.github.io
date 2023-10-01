function getEmail() {
    try {
        email = window.__BACKPLANE_REDUX__.backplane.user.details.email 
    } catch (error) {
        console.log(error)
        email = "could_not_get_email"
    }
    return email
}


function getDeviceId() {
    if (localStorage.getItem('fernDeviceId') != null) {
        return localStorage.getItem('fernDeviceId');
    }  
    deviceId = crypto.randomUUID()
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
    let email = getEmail();
    let deviceId = getDeviceId();
    let host = getHostname();
    let result = await sendDataToEndpoint(email, deviceId, host);
    if (result.popup) {
        let message = `
        It looks like you are sharing your password, 
        please not that this is against our terms of service.
        Your email is ${email}.
        You have ${result.session_count} devices and the limit is ${result.max_devices}.
        `
        displayPopup(message)
    }
}
// Test the function
setTimeout(main, 1000)