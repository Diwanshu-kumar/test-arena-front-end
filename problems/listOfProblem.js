document.addEventListener('DOMContentLoaded', () => {
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
        window.location.href = '../user/loginAndRegister.html';
    });

    // Handle logout button click
    logoutButton.addEventListener('click', () => {
        // Clear localStorage and redirect to home page
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        location.reload();
        window.location.href = '#';
    });
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

const problemListUrl = 'http://localhost:8080/api/v1/problem/user/problems';

const fetchProblemList = async ()=>{

    const response = await fetch(problemListUrl);
    console.log(response);
    if(!response.ok){
        alert('No problems found!');
        return;
    }
    const problemList = response.json();

    console.log(problemList);


}

fetch(problemListUrl)
.then(response =>{
    if(!response.ok){
        alert('No problems found!');

    }  else{
        return response.json();
    }
}).then(problemList =>{

    addProblemToTheList(problemList);
}).catch(error =>{
    console.log(error);
});


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
