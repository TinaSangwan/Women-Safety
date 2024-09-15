document.getElementById('emergencyButton').addEventListener('click', function() {
    const message = document.getElementById('alertMessage').value;
    const template = document.getElementById('messageTemplates').value;

    if (message || template) {
        const alertMessage = template || message;
        sendAlertToAllContacts(alertMessage);
        addToAlertHistory(alertMessage);
        document.getElementById('alertMessage').value = '';
        document.getElementById('messageTemplates').value = '';
    } else {
        showNotification('Please enter a message or select a template.');
    }
});

function sendAlertToAllContacts(message) {
    const contactList = document.getElementById('contactList');
    const contacts = contactList.querySelectorAll('li');
    
    if (contacts.length === 0) {
        showNotification('No contacts saved.');
        return;
    }

    contacts.forEach(contact => {
        const number = contact.dataset.number;
        // Simulate sending a message to each contact
        showNotification(`Alert sent to ${number}: ${message}`);
    });
}

function addToAlertHistory(message) {
    const historyList = document.getElementById('historyList');
    const li = document.createElement('li');
    li.textContent = message;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        li.remove();
        showNotification('Alert history item deleted.');
    });
    li.appendChild(deleteButton);
    historyList.appendChild(li);
}

document.getElementById('deleteHistory').addEventListener('click', function() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    showNotification('Alert history cleared.');
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function callNumber(number) {
    window.location.href = `tel:${number}`;
}

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Function to share location
document.getElementById('locationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true });
    } else {
        showNotification('Geolocation is not supported by this browser.');
    }
});

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locationMessage = `I am at https://www.google.com/maps?q=${lat},${lon}`;
    const alertMessageField = document.getElementById('alertMessage');
    alertMessageField.value = `${alertMessageField.value}\n${locationMessage}`;
    showNotification('Location added to message.');
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            showNotification("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            showNotification("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            showNotification("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            showNotification("An unknown error occurred.");
            break;
    }
}

// Add contact to the list
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const number = document.getElementById('contactNumber').value;

    if (name && number) {
        const contactList = document.getElementById('contactList');
        const li = document.createElement('li');
        li.textContent = `${name} - ${number}`;
        li.dataset.number = number;

        const callButton = document.createElement('button');
        callButton.textContent = 'Call';
        callButton.addEventListener('click', function() {
            callNumber(number);
        });

        li.appendChild(callButton);
        contactList.appendChild(li);

        document.getElementById('contactName').value = '';
        document.getElementById('contactNumber').value = '';
    } else {
        showNotification('Please enter both name and number.');
    }
});

// Show safe space based on current location
function showSafeSpace(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const safeSpaceURL = `https://example.com/getSafeSpace?lat=${lat}&lon=${lon}`; // Replace with actual URL
    fetch(safeSpaceURL)
        .then(response => response.json())
        .then(data => {
            document.getElementById('safeSpaceMessage').textContent = `Safe Space: ${data.safeSpaceName}. Address: ${data.safeSpaceAddress}.`;
            const mapURL = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${data.safeSpaceAddress.replace(/\s+/g, '+')}`;
            document.getElementById('safeSpaceMap').src = mapURL;
        })
        .catch(() => {
            document.getElementById('safeSpaceMessage').textContent = 'Could not retrieve safe space information.';
        });
}

// Automatically get current location and show safe space map on load
window.addEventListener('load', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showSafeSpace, showError, { enableHighAccuracy: true });
    } else {
        document.getElementById('safeSpaceMessage').textContent = 'Geolocation is not supported by this browser.';
    }
});


function initMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -34.397, lng: 150.644 }, // Default coordinates
            zoom: 8
        });
    }
}

// Function to initialize the map
function initMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -34.397, lng: 150.644 }, // Default coordinates
            zoom: 8
        });
    }
}

// Automatically get current location and show safe space map on load
window.addEventListener('load', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showSafeSpace, showError, { enableHighAccuracy: true });
    } else {
        document.getElementById('safeSpaceMessage').textContent = 'Geolocation is not supported by this browser.';
    }
});
