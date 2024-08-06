import {loginAndLogout} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginPage = "./user/loginAndRegister.html";
    const homePage = "./index.html";

    loginAndLogout(`${loginPage}?redirect=${window.location.href}`,homePage);
});