// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: "text/x-c++src", // Default mode
    lineNumbers: true,
    theme: "default"
});

// Update the mode based on selected language
document.getElementById('language').addEventListener('change', function() {
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
});

// Event listeners for Run and Submit buttons
document.getElementById('runButton').addEventListener('click', function() {
    // Handle Run button logic
    console.log('Run button clicked');
});

document.getElementById('submitButton').addEventListener('click', function() {
    // Handle Submit button logic
    console.log('Submit button clicked');
});

const urlParams = new URLSearchParams(window.location.search);
const problemId = decodeURIComponent(urlParams.get("problemId"));

const url = `http://localhost:8080/api/v1/problem/details?problemId=${problemId}`;

// Function to fetch problem details and populate the HTML
function fetchProblemDetails(problemId) {
    const url = `http://localhost:8080/api/v1/problem/details?problemId=${problemId}`;

    fetch(url)
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

document.addEventListener('DOMContentLoaded', () => {
    // Load saved data from localStorage
    editor.setSize(null,"500px");
    const savedCode = localStorage.getItem('codeEditorContent');
    if (savedCode) {
        editor.setValue(savedCode);
    }

    // Save data to localStorage on change
    editor.on('change', () => {
        localStorage.setItem('codeEditorContent', editor.getValue());
    });
});

const runOutputContainer = document.getElementById("run-output-container");
let verdict =document.getElementById("verdictOutput");

const runButton = document.getElementById('runButton');
const submitButton = document.getElementById('submitButton');

// Handle "Run" button click
runButton.addEventListener('click', () => {
    runButton.disabled = true;
    removeRunStatus();
    const code = editor.getValue();
    const userId = '1'; // Replace with actual user ID
    const language = document.getElementById('language').value; // Replace with actual selected language
    const requestData = {
        userId: userId,
        language: language,
        code: code,
        problemId: problemId
    };

    fetch('http://localhost:8080/api/v1/user/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            runButton.disabled = false;
            console.log('Success:', data);
            // Handle the response data here, e.g., display the output
            document.getElementById("sampleOutput").innerHTML=`${data.result} \n*****************************************\nexecution time = ${data.executionTime} ms`
        })
        .catch((error) => {
            runButton.disabled = false;
            console.error('Error:', error);
            const runOutputContainer = document.getElementById("run-output-container");
            let verdict =document.getElementById("verdictOutput");
            verdict.innerText = "connection issue";
            verdict.className = "status error";
            runOutputContainer.insertBefore(verdict,runOutputContainer.firstChild);
            // Handle errors here
        });
});

const removeRunStatus = () =>{
    verdict.innerText = "";
    verdict.className = "";
}


// Handle "submit" button click
submitButton.addEventListener('click', () => {
    removeRunStatus();
    submitButton.disabled = true;
    const code = editor.getValue();
    const userId = '1'; // Replace with actual user ID
    const language = document.getElementById('language').value; // Replace with actual selected language
    const requestData = {
        userId: userId,
        language: language,
        code: code,
        problemId: problemId
    };

    fetch('http://localhost:8080/api/v1/user/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            submitButton.disabled = false;
            console.log('Success:', data);
            // Handle the response data here, e.g., display the output
            const sampleOutput =document.getElementById("sampleOutput");
            if(data.verdict==="AC"){
                verdict.innerText = "Accepted";
                verdict.className = "status accepted";
            }else if(data.verdict==="WA"){
                verdict.innerText = "Wrong-answer";
                verdict.className = "status wrong-answer";
            }else if(data.verdict==="TLE"){
                verdict.innerText = "TLE";
                verdict.className = "status tle";
            }else{
                verdict.innerText = "error";
                verdict.className = "status error";
            }
            sampleOutput.innerHTML=`${data.result} \n*****************************************\nexecution time = ${data.executionTime} ms`
            runOutputContainer.insertBefore(verdict,runOutputContainer.firstChild);
        })
        .catch((error) => {
            submitButton.disabled = false;
            console.error('Error:', error);
            const runOutputContainer = document.getElementById("run-output-container");
            let verdict =document.getElementById("verdictOutput");
            verdict.innerText = "connection issue";
            verdict.className = "status error";
            runOutputContainer.insertBefore(verdict,runOutputContainer.firstChild);
            // Handle errors here
        });
});

