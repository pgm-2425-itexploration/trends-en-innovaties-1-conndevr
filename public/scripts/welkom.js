async function fetchWelcomeMessage() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('You are not authorized. Please log in first.');
        window.location.href = '/login';
        return;
    }

    const response = await fetch('/user/welcome', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const result = await response.json();
    if (result.message) {
        document.getElementById('welcomeMessage').innerText = result.message;
    } else {
        document.getElementById('welcomeMessage').innerText = 'Failed to load the welcome message.';
    }
}

function logout() {

    localStorage.removeItem('token');
    window.location.href = '/login';
}

// Roep de functie aan om de welkomstboodschap te laden zodra de pagina is geladen
window.onload = fetchWelcomeMessage;