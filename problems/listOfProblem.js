import {loginAndLogout} from "../utils.js";
import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;
const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");

document.addEventListener('DOMContentLoaded', () => {
   const loginPage = "./../user/loginAndRegister.html";
   const homePage = "./../index.html";

   loginAndLogout(`${loginPage}?redirect=${window.location.href}`,homePage);
});


/*************************login and logout part above ************/




// fetch list of problems

const problemListUrl = `${API_BASE_URL}/problem/user/problems`;

const fetchProblemList = async ()=>{
    const response = await fetch(problemListUrl,{
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + AUTH_TOKEN,
        }
    });
    if(!response.ok){
        alert('No problems found!');
        return;
    }
    const problemList = await response.json();
    renderProblemList(problemList);


}


// Function to render the problem list
function renderProblemList(problems) {
    const problemList = document.getElementById('problemList');
    problemList.innerHTML = '';

    problems.forEach((problem,index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item problem-item d-flex justify-content-between align-items-center';
        listItem.setAttribute('data-id', problem.id);
        const difficulty = problem.difficulty?problem.difficulty:"not available";
        listItem.innerHTML = `
                    <a href="./solveProblem.html?problemId=${problem.problemId}">
                        <span class="problem-title mx-2">${index+1}.</span>
                        <span class="problem-title">${problem.title}</span>
                    </a>
                    <span class="badge difficulty difficulty-type-${difficulty}">${difficulty}</span>
                `;

        problemList.appendChild(listItem);
    });
}

// Initialize the problem list on page load
document.addEventListener('DOMContentLoaded', fetchProblemList);
