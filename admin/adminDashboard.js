import {loginAndLogout} from "../utils.js";
import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;
const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
const LOGIN_PAGE_URL = `./../user/loginAndRegister.html?redirect=${encodeURIComponent(window.location.href)}`;

document.addEventListener('DOMContentLoaded', () => {
    const homePage = "./../index.html";

    loginAndLogout(LOGIN_PAGE_URL,homePage);
});




const problemListUrl = `${API_BASE_URL}/problem/admin/problems`;


const allProblemList = document.getElementById('all-problems');
const pendingProblemList = document.getElementById('pending-problems');
const approvedProblemList = document.getElementById('approved-problems');

allProblemList.addEventListener('click', (e) => {
    e.preventDefault();
    clearProblemList();
    fetchProblemList(`${problemListUrl}?status=pending`);
    fetchProblemList(`${problemListUrl}?status=approved`);
})

pendingProblemList.addEventListener('click', (e) => {
    e.preventDefault();
    clearProblemList();
    fetchProblemList(`${problemListUrl}?status=pending`);
})

approvedProblemList.addEventListener('click', (e) => {
    e.preventDefault();
    clearProblemList();
    fetchProblemList(`${problemListUrl}?status=approved`);
})

const clearProblemList = ()=>{
    document.querySelector('.row').innerHTML="";
}

const fetchProblemList = (problemListUrl) =>{

    // If token is not present, prompt the user to log in
    if (!AUTH_TOKEN) {
        const content = document.getElementById('content');
        content.innerHTML = `<h4 class="m-5">
                <a style="text-decoration : none" href=${LOGIN_PAGE_URL}>Login </a> to see the problmes. </h4>`
        return;
    }

    fetch(problemListUrl,{
        method: 'GET',
        headers : {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
        }
    })
        .then(response =>{
            if(!response.ok){
                alert('No problems found!');

            }  else{
                return response.json();
            }
        }).then(problemList =>{

        listProblems(problemList);
    }).catch(error =>{
        console.log(error);
    });
}

clearProblemList();
fetchProblemList(problemListUrl+"?status=pending");

const listProblems = (problemList) => {

    const container = document.querySelector('.row'); // Assuming the container is a div with class 'row'
    problemList.forEach(problem => {
        // Create the card element
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';

        // Set the card's inner HTML
        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                <a class="text-decoration-none" href="./../Problems/solveProblem.html?problemId=${problem.problemId}">
                
                    <h5 class="card-title">${problem.title}</h5>
                    <p class="card-text">ID: ${problem.problemId}</p>
                </a>
                    <p>Status: <span class="badge ${problem.status === 'Approved' ? 'bg-success' : 'bg-secondary'}">${problem.status}</span></p>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm toggle-status">${problem.status === 'Approved' ? 'Set to Pending' : 'Set to Approved'}</button>
                        <button class="btn btn-outline-danger btn-sm delete-problem">Delete</button>
                    </div>
                </div>
            </div>
        `;

        // Append the card to the container
        container.appendChild(card);

        // Add event listeners to the buttons
        const toggleStatusButton = card.querySelector('.toggle-status');
        const deleteButton = card.querySelector('.delete-problem');
        const statusBadge = card.querySelector('.badge');

        toggleStatusButton.addEventListener('click', () => {
            if (statusBadge.textContent === 'Approved') {
                if(!setProblemStatus("Pending",problem.problemId )) {
                    alert("some error occurred");
                    return;
                }
                statusBadge.textContent = 'Pending';
                statusBadge.classList.replace('bg-success', 'bg-secondary');
                toggleStatusButton.textContent = 'Set to Approved';
            } else {
                if(!setProblemStatus("Approved",problem.problemId )) {
                    alert("some error occurred");
                    return;
                }
                statusBadge.textContent = 'Approved';
                statusBadge.classList.replace('bg-secondary', 'bg-success');
                toggleStatusButton.textContent = 'Set to Pending';
            }
        });

        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this problem?')) {
                if(deleteProblem(problem.problemId)){
                    card.remove();

                }
            }
        });
    });
};

const deleteProblem = async (problemId)=>{
    await fetch(API_BASE_URL+'/problem/admin/delete?problemId='+problemId,{
        method:'DELETE',
        headers : {
            'Authorization' : 'Bearer ' + AUTH_TOKEN,
        }

    }).then(response =>{
        if(!response.ok){
            alert('No problems found!');
        }
        return response.ok;
    }).then(data=>{
        return data;
    }).catch(err =>{
        console.log(err);
    })
    return false;
}


const setProblemStatus = async (status, problemId) =>{
    console.log(status+ " "+problemId);
    await fetch(`${API_BASE_URL}/problem/admin/update?problemId=${problemId}&status=${status}`, {

        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + AUTH_TOKEN,
        }
    }).then(response => {
        return response.ok;

    }).then(data =>{
        return data;
    }).catch(err =>{
        console.log(err);
    })
    return false;
}

