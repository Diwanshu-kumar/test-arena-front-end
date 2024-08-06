import {loginAndLogout,loginModal} from "../utils.js";
import CONFIG  from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;
const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
const LOGIN_PAGE_URL = `./../user/loginAndRegister.html?redirect=${encodeURIComponent(window.location.href)}`


document.addEventListener('DOMContentLoaded', () => {
    const homePage = "./../index.html";
    if(!AUTH_TOKEN){
        loginModal(LOGIN_PAGE_URL," to Add problem. ");
        const submitProblemBtn = document.getElementById('submit-problem-btn');
        submitProblemBtn.setAttribute("data-bs-toggle", "modal");
        submitProblemBtn.setAttribute("data-bs-target","#staticBackdrop");
    }
    loginAndLogout(LOGIN_PAGE_URL,homePage);
});


/******* login and logout validation above ******/


// Initialize EasyMDE for all markdown-editor textareas
document.querySelectorAll('.markdown-editor').forEach(textarea => {
    new EasyMDE({ element: textarea });
});

// Functionality for adding more test cases field dynamically
let testCaseCount = 1;

const creatTestCaseField = (fieldType)=>{
    const inputDiv = document.createElement('div');
    inputDiv.className = `form-group testcase-${fieldType}`;
    const newInputLabel = document.createElement('label');
    newInputLabel.setAttribute('for', `systemTest${fieldType}${testCaseCount}`);
    newInputLabel.textContent = `System Test Case ${fieldType} ${testCaseCount}`;
    const newInputTextarea = document.createElement('textarea');
    newInputTextarea.className = `form-control system-testcase-${fieldType}`;
    newInputTextarea.id = `systemTest${fieldType}${testCaseCount}`;
    newInputTextarea.rows = 2;
    inputDiv.appendChild(newInputLabel);
    inputDiv.appendChild(newInputTextarea);
    return inputDiv;
}


const addOneSystemTestCaseField = ()=>{
    testCaseCount++;
    const testCaseContainer = document.getElementById('systemTestCases');

    const newInputDiv = creatTestCaseField("input");
    const newOutputDiv = creatTestCaseField("output");

    testCaseContainer.appendChild(newInputDiv);
    testCaseContainer.appendChild(newOutputDiv);

}


document.getElementById('addTestCaseBtn').addEventListener('click', addOneSystemTestCaseField );




// functionality to get the data and submit to the api.


const generateJson = ()=> {
    // Extract form data
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const constraint = document.getElementById('constraint').value;
    const sampleInput = document.getElementById('sampleInput').value;
    const sampleOutput = document.getElementById('sampleOutput').value;
    const explanation = document.getElementById('explanation').value;

    // Extract system test cases
    const testCases = [];
    const systemTestCaseInputs = document.querySelectorAll('.system-testcase-input');
    const systemTestCaseOutputs = document.querySelectorAll('.system-testcase-output');

    systemTestCaseInputs.forEach((inputField, index) => {
        if (inputField.value && systemTestCaseOutputs[index].value) {
            testCases.push({
                input: inputField.value,
                expectedOutput: systemTestCaseOutputs[index].value
            });
        }
    });

    // Convert Markdown to HTML
    const convertMarkdownToHTML = (markdownText) => {
        return marked.parse(markdownText);
    }

    const jsonData = {
        title: title,
        description: convertMarkdownToHTML(description),
        problemConstraint: convertMarkdownToHTML(constraint),
        sampleInput: sampleInput,
        sampleOutput: sampleOutput,
        explanation: convertMarkdownToHTML(explanation),
        systemTestCase: testCases
    };

    // Print JSON to console (or you could send it to your server)
    console.log(JSON.stringify(jsonData, null, 2));

    // alert(JSON.stringify(jsonData, null, 2));
    return jsonData;
}

document.getElementById('newProblemForm').addEventListener('submit', (event)=>{
    event.preventDefault();
    if(!AUTH_TOKEN)
        return;
    const problemData = generateJson();

    // Send the POST request using fetch
    fetch(`${API_BASE_URL}/problem/user/newProblem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + AUTH_TOKEN,
        },
        body: JSON.stringify(problemData),
    })
        .then(response => {
            // Check if the response status is OK (status code 200-299)
            if (response.ok) {
                return response.text(); // or response.json() if the response is JSON
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            // Display a success alert
            alert('Problem added successfully!');
            console.log('Success:', data);
        })
        .catch((error) => {
            // Display an error alert
            alert('Failed to add problem: ' + error.message);
            console.error('Error:', error);
        });    
});
