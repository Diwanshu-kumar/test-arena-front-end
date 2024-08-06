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

const usernameElement = document.getElementById('username');
const fullNameElement = document.getElementById('fullname');
const totalSolvedElement = document.getElementById('total-solved');
const problemsAttemptedElement = document.getElementById('problems-attempted');
const totalSubmissionsElement = document.getElementById('total-submissions');

// Replace with your actual data
const userData = {
    username: 'your_username',
    fullName: 'Your Full Name',
    totalSolved: 123,
    problemsAttempted: 456,
    totalSubmissions: 789
};

usernameElement.textContent = userData.username;
fullNameElement.textContent = userData.fullName;
totalSolvedElement.textContent = userData.totalSolved;
problemsAttemptedElement.textContent = userData.problemsAttempted;
totalSubmissionsElement.textContent = userData.totalSubmissions;



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
    addProblemToTheList(problemList);


}

fetchProblemList();


const problemListContainer = document.getElementById('problems-container');
// problemListContainer.innerText = "";
const addProblemToTheList = (problemList)=>{
    problemList.forEach((problem ,index)=> {

        let problemItem = document.createElement('div');
        problemItem.setAttribute('id', 'problem-' + problem.problemId);
        problemItem.className="problem-item";
        let problemLink = document.createElement('a');
        problemLink.setAttribute('href', `./solveProblem.html?problemId=${problem.problemId}`);
        problemLink.setAttribute('target', '_blank');
        let row = document.createElement('div');
        row.setAttribute('class', 'row');

        let sN = document.createElement('div');
        sN.className= "col-1";
        sN.innerHTML = index+1;

        let problemId = document.createElement('div');
        problemId.innerHTML = problem.problemId;
        problemId.className= "col-3";

        let problemTitle = document.createElement('div');
        problemTitle.className = "col-6";
        problemTitle.innerText = problem.title;

        row.appendChild(sN);
        row.appendChild(problemId);
        row.appendChild(problemTitle);

        problemLink.appendChild(row);
        problemItem.appendChild(problemLink);
        problemListContainer.appendChild(problemItem);
    });
}
