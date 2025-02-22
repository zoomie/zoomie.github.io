function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if the cookie starts with the desired name
        if (cookie.startsWith(name + '=')) {
            // Return the value of the cookie
            return cookie.substring(name.length + 1);
        }
    }
    // If the cookie is not found, return null or an appropriate default value
    return null;
}

function getEmail() {
    try {
        email = getCookie('tf_email') 
    } catch (error) {
        console.log(error)
        email = "could_not_get_email"
    }
    return email
}