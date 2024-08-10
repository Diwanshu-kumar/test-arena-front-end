const loginAndLogout = (loginPage, homePage) => {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userDetails = document.getElementById('userDetails');
    const usernameDisplay = document.getElementById('usernameDisplay');


    // Check if user is logged in
    const AUTH_TOKEN = localStorage.getItem('AUTH_TOKEN');
    const username = localStorage.getItem('username');

    if (AUTH_TOKEN && username) {
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
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('username');
        console.log(homePage);
        localStorage.removeItem('AUTH_TOKEN');
        location.reload();
        // window.location.href = "./../index.html";
    });
}

const  isTokenExpired =(token) =>{
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    console.log(expiry);
    return Date.now() > expiry;
}



const loginModal = (loginPage,message) => {

    const node = document.createElement('div');
    node.innerHTML = `
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Login </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body m-2 " id="model-body">
                        <h3><a style="text-decoration: none" href=${loginPage}>Login </a> ${message} </h3>
                    </div>
                </div>
            </div>
        </div>`

    document.body.appendChild(node);
}


export {loginAndLogout , loginModal, isTokenExpired};