import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;


const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get("redirect");

// Event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(registrationForm);
        const data = {
            name: formData.get('full-name'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        };
        console.log(data);
        submitData(`${API_BASE_URL}/auth/register`, data, 'register');
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const loginForm = document.getElementById('loginForm');
    // Get form values
        const formData = new FormData(loginForm);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        };
    // Prepare the data for the POST request
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    // Send the login request
    fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                return response.text().then(message => {
                    throw new Error(message); // Throw an error with the response message
                });
            }
        })
        .then(data => {
            // Store the JWT token in local storage
            localStorage.setItem('jwtToken', data.jwt);
            localStorage.setItem('username', data.username);
            console.log('Login successful! Token stored.');
            // console.log(redirectUrl);
            // Redirect to the home page
            if(redirectUrl){
                window.location.href = decodeURIComponent(redirectUrl);
            }else
                window.location.href = "./../index.html";
        })
        .catch(error => {
            // Handle errors (e.g., invalid credentials)
            console.error('Error:', error);
            alert('Login failed: ' + error.message);
        });
});


function submitData(url, data, type) {

    fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.status === 409) {
                // Handle conflict
                return response.text().then(message => {
                    console.error('Conflict error:', message);
                    alert('Error: ' + message); // Display the error message
                });
            } else if (!response.ok) {
                // Handle other errors
                return response.text().then(message => {
                    console.error('Error:', message);
                    alert('Error: ' + message); // Display the error message
                });
            } else {
                // Success
                return response.text().then(message => {
                    console.log('Success:', message);
                    alert('Success: ' + message); // Display success message
                    showLoginForm();
                });
            }
        })
        .catch((error) => {
            console.error('Network Error:', error);
            alert('A network error occurred. Please try again later.');
        });

}

function showRegistrationForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registrationForm').style.display = 'none';
}
