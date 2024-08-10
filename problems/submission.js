import {loginAndLogout} from "../utils.js";
import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;

const urlParams = new URLSearchParams(window.location.search);
const problemId = decodeURIComponent(urlParams.get("problemId"));

document.addEventListener("DOMContentLoaded", () => {

    loginAndLogout(LOGIN_PAGE_URL,
        encodeURIComponent("./../index.html"));
})


const USERNAME = localStorage.getItem("username");

// Define the API endpoint
const API_URL = `${API_BASE_URL}/user/submissions?username=${USERNAME}`;
const LOGIN_PAGE_URL = `./../user/loginAndRegister.html?redirect=${encodeURIComponent(window.location.href)}`;
const AUTH_TOKEN = localStorage.getItem('AUTH_TOKEN');


// Function to fetch submission data
const fetchSubmissions = async () => {

    // If token is not present, prompt the user to log in
    if (!AUTH_TOKEN) {

        document.getElementById("submission-table-container").innerHTML = `<h4 class="m-5">
                <a style="text-decoration : none" href=${LOGIN_PAGE_URL}>Login </a> to see your submissions. </h4>`
        return;
    }

    try {
        // Fetch submission data from the API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}` // Attach the JWT token
            }
        });
        if(response.status === 401){
            localStorage.removeItem("AUTH_TOKEN");
            loginAndLogout(LOGIN_PAGE_URL,
                encodeURIComponent("./../index.html"));
            document.getElementById("submission-table-container").innerHTML = `<h4 class="m-5">Session expired please 
                <a style="text-decoration : none" href=${LOGIN_PAGE_URL}>Login </a> again to see your submissions. </h4>`
            return;
        }

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch submissions. try login again');
        }

        // Parse the JSON response
        const submissions = await response.json();

        if (submissions.length === 0) {
            document.getElementById("submission-table-container").innerHTML = `<h4 class="m-5">You haven't made any submissions yet!</h4>`
        } else {
            displaySubmissions(submissions);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to show submissions. Please try login again.');
    }
}


// Function to display submissions on the page
function displaySubmissions(submissions) {
    const tbody = document.getElementById('submission-tbody');
    tbody.innerHTML = '';

    submissions.forEach((submission, index) => {
        const row = document.createElement('tr');

        const submissionDateAndTime = getDateAndTime(submission.submissionTime);
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${submissionDateAndTime.formattedDate} ${submissionDateAndTime.formattedTime}</td>
            <td class="submission-id" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><a style="text-decoration: none" href="#">${submission.submissionId}</a></td>
            <td>${submission.language}</td>
            <td><a style="text-decoration: none" href="./solveProblem.html?problemId=${submission.problemId}"> ${submission.problemId} </a></td>
            <td>${submission.executionTime} ms</td>
            <td><span class="badge ${submission.status === 'AC' ? 'bg-success' : 'bg-danger'}">${submission.status}</span></td>
        `;


        //showing code for each submission when user click on submission id.
        const viewSubmissionCode = row.querySelector(".submission-id");
        viewSubmissionCode.addEventListener('click', async (e) => {
            e.preventDefault();
            const submissionId = e.target.innerText;
            const responseCode = openSubmittedCode(submissionId);
            const modelSubmissionId = document.getElementById("staticBackdropLabel");
            const modelBody = document.getElementById("model-body");

            modelSubmissionId.innerHTML = `submission ID : #${submissionId}`
            let code;
            await responseCode.then(result => {
                code = result;
            });

            modelBody.innerHTML = `<pre><code id="codeContent">${escapeHtml(code)}</code></pre>`;
        })


        tbody.appendChild(row);
    });
}

// escaping potentially unsafe escape character which can break the HTML rendering.
const escapeHtml = (unsafe) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(unsafe));
    return div.innerHTML;
}


const getDateAndTime = (submissionTime) => {
// Create a new Date object
    const dateObj = new Date(submissionTime);

// Extract the date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');

// Extract the time components
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

// Format date and time
    const formattedDate = `${day}-${month}-${year}`
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return {formattedDate, formattedTime};
}


// Call fetchSubmissions when the page loads
document.addEventListener('DOMContentLoaded', fetchSubmissions);


// open submitted code

const openSubmittedCode = async (submissionId) => {
    let submittedCode = "code not found";
    try {
        const response = await fetch(`${API_BASE_URL}/user/submissions/code?submissionId=${submissionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            submittedCode = data.code;
        }


    } catch (error) {
        console.log(error);
    }

    return submittedCode;

}


// copy code functionality

const copyCodeBtn = document.getElementById("copy-code");

copyCodeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const codeElement = document.getElementById('codeContent');
    const codeText = codeElement.innerText;

    // Copy the code to the clipboard
    navigator.clipboard.writeText(codeText).then(() => {
        // Provide feedback to the user (optional)
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Error copying code: ', err);
    });
})