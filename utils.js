const loginAndLogout = (loginPage, homePage) =>{
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userDetails = document.getElementById('userDetails');
    const usernameDisplay = document.getElementById('usernameDisplay');


    // Check if user is logged in
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');

    if (token && username) {
        loginButton.classList.add('d-none');
        usernameDisplay.textContent = username;
        userDetails.classList.remove('d-none');
    } else {
        loginButton.classList.remove('d-none');
        userDetails.classList.add('d-none');
    }

    // Handle login button click
    loginButton.addEventListener('click', () => {
        // Redirect to login page
        window.location.href = loginPage;
    });

    // Handle logout button click
    logoutButton.addEventListener('click', () => {
        // Clear localStorage and redirect to home page
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        console.log(homePage);
        location.reload();
        // window.location.href = "./../index.html";
    });
}

export default loginAndLogout;