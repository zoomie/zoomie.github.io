


async function displayPopup() {
    let resp = await fetch("https://us-central1-nodal-figure-204805.cloudfunctions.net/staging")
    console.log(resp)
    let data = await resp.json()
    console.log(data.msg)

    message = data.msg
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

// Test the function
setTimeout(displayPopup, 1000)