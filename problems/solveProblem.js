import {loginAndLogout,loginModal} from "../utils.js";
import CONFIG from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;
const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
const urlParams = new URLSearchParams(window.location.search);
const problemId = decodeURIComponent(urlParams.get("problemId"));
const LOGIN_PAGE_URL = `./../user/loginAndRegister.html?redirect=${encodeURIComponent(window.location.href)}`

document.addEventListener("DOMContentLoaded", () => {
    loginAndLogout(LOGIN_PAGE_URL,
        encodeURIComponent("./../index.html"));
})

/******************** above code check login and logout state *****************/

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: "text/x-c++src", // Default mode
    lineNumbers: true,
    theme: "default"
});

// Update the mode based on selected language
document.getElementById('language').addEventListener('change', function () {
    let mode = 'text/x-c++src'; // Default
    switch (this.value) {
        case 'java':
            mode = 'text/x-java';
            break;
        case 'python':
            mode = 'text/x-python';
            break;
    }
    editor.setOption('mode', mode);
    loadEditorContent();
});


// Function to fetch problem details and populate the HTML
function fetchProblemDetails(problemId) {
    const url = `${API_BASE_URL}/problem/details?problemId=${problemId}`;

    fetch(url,{
        method: 'GET',
        mode: 'cors',
        headers : {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                document.body.innerHTML = "<h3>problem does not exist.</h3>";
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            console.log(data);
            // Populate the HTML elements with the problem data
            document.getElementById('problem-title').innerText = data.title;
            document.getElementById('problem-description').innerHTML = (data.description);
            document.getElementById('problem-constraints').innerHTML = `<h4>Problem constraints</h4><p>${data.problemConstraint}</p>`
            document.getElementById('problem-sample-input').innerHTML = `<strong>Sample Input:</strong> <pre>${data.sampleInput}</pre>`;
            document.getElementById('problem-sample-output').innerHTML = `<strong>Sample Output:</strong> <pre>${data.sampleOutput}</pre>`;
            document.getElementById('problem-explanation').innerHTML = `<strong>Explanation</strong><div>${data.explanation}</div>`
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Assuming you have a way to get the problemId, for example:
fetchProblemDetails(problemId);

const loadEditorContent = ()=>{
    const editorLang = document.getElementById('language');

    const editorContentKey = `codeEditorContent=problemId${problemId}=lang=${
        editorLang.value
    }`;

    let savedCode = localStorage.getItem(editorContentKey);
    if(!savedCode){
        savedCode = "// start writing code here!";
    }

    editor.setValue(savedCode);

    // Save data to localStorage on change
    editor.on('change', () => {
        const key = `codeEditorContent=problemId${problemId}=lang=${
            editorLang.value
        }`;
        localStorage.setItem(key, editor.getValue());
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // check if login or not?

    if(!AUTH_TOKEN){
        addLoginModalToPage(" to run of submit!");
    }

    // Load saved data from localStorage

    editor.setSize(null, "500px");
    loadEditorContent();
});


/*****run and submit behaviour ****************/

const runOutputContainer = document.getElementById("run-output-container");
let verdict = document.getElementById("verdictOutput");

const runButton = document.getElementById('runButton');
const submitButton = document.getElementById('submitButton');

const addLoginModalToPage =(message)=>{
     loginModal(LOGIN_PAGE_URL,message);
    runButton.setAttribute("data-bs-toggle", "modal");
    runButton.setAttribute("data-bs-target","#staticBackdrop");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target","#staticBackdrop");
}
// Handle "Run" button click
runButton.addEventListener('click', () => {
    if(!AUTH_TOKEN)return;
    runButton.disabled = true;
    removeRunStatus();
    const code = editor.getValue();
    const USERNAME = localStorage.getItem('username'); // Replace with actual user ID
    const language = document.getElementById('language').value; // Replace with actual selected language

    const customInput = ""+document.getElementById("customInput").value;
    let requestData;
    let runUrl = `${API_BASE_URL}/user/`;
    if(customInput.length>0){
        runUrl+="runOnCustomTestcase"
        requestData = {
            language : language,
            code : code,
            customInput : customInput
        };
    }else {
        runUrl+="run";
        requestData = {
            username: USERNAME,
            language: language,
            code: code,
            problemId: problemId
        };
    }

    console.log(requestData);

    fetch(runUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AUTH_TOKEN,
        },
        body: JSON.stringify(requestData),
    })
        .then(response =>{
            if(response.status===401){
                localStorage.removeItem("AUTH_TOKEN");
                loginAndLogout(LOGIN_PAGE_URL,encodeURIComponent("./../index.html"))
                alert("Session expired please log in again.");
                throw new Error("Session expired ");
            }

            return response.json();
        })
        .then(data => {
            runButton.disabled = false;
            console.log('Success:', data);
            // Handle the response data here, e.g., display the output
            document.getElementById("sampleOutput").innerHTML = `${data.result} \n*****************************************\nexecution time = ${data.executionTime} ms`
        })
        .catch((error) => {
            runButton.disabled = false;
            console.error('Error:', error);
            const runOutputContainer = document.getElementById("run-output-container");
            let verdict = document.getElementById("verdictOutput");
            verdict.innerText = "connection issue";
            verdict.className = "status error";
            runOutputContainer.insertBefore(verdict, runOutputContainer.firstChild);
            // Handle errors here
        });
});

const removeRunStatus = () => {
    verdict.innerText = "";
    verdict.className = "";
}


// Handle "submit" button click
submitButton.addEventListener('click', () => {
    if(!AUTH_TOKEN)return;
    removeRunStatus();
    submitButton.disabled = true;
    const code = editor.getValue();
    const username = localStorage.getItem('username'); // Replace with actual user ID
    const language = document.getElementById('language').value; // Replace with actual selected language
    const requestData = {
        username: username,
        language: language,
        code: code,
        problemId: problemId
    };

    fetch(`${API_BASE_URL}/user/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AUTH_TOKEN,
        },
        body: JSON.stringify(requestData),
    })
        .then(response =>{
            if(response.status===401 || response.status===403){
                localStorage.removeItem("AUTH_TOKEN");
                loginAndLogout(LOGIN_PAGE_URL,encodeURIComponent("./../index.html"))
                alert("Session expired please log in again.");
                throw new Error("Session expired ");
            }
            return response.json();
        } )
        .then(data => {
            submitButton.disabled = false;
            console.log('Success:', data);
            // Handle the response data here, e.g., display the output
            const sampleOutput = document.getElementById("sampleOutput");
            if (data.verdict === "AC") {
                verdict.innerText = "Accepted";
                verdict.className = "status accepted";
            } else if (data.verdict === "WA") {
                verdict.innerText = "Wrong-answer";
                verdict.className = "status wrong-answer";
            } else if (data.verdict === "TLE") {
                verdict.innerText = "TLE";
                verdict.className = "status tle";
            } else {
                verdict.innerText = "error";
                verdict.className = "status error";
            }
            sampleOutput.innerHTML = `${data.result} \n*****************************************\nexecution time = ${data.executionTime} ms`
            runOutputContainer.insertBefore(verdict, runOutputContainer.firstChild);
        })
        .catch((error) => {
            submitButton.disabled = false;
            console.error('Error:', error);
            const runOutputContainer = document.getElementById("run-output-container");
            let verdict = document.getElementById("verdictOutput");
            verdict.innerText = "connection issue";
            verdict.className = "status error";
            runOutputContainer.insertBefore(verdict, runOutputContainer.firstChild);
            // Handle errors here
        });
});

