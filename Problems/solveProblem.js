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


const problemId = 26;

const url = `http://localhost:8080/api/v1/problem/details?problemId=${problemId}`;

// Function to fetch problem details and populate the HTML
function fetchProblemDetails(problemId) {
    const url = `http://localhost:8080/api/v1/problem/details?problemId=${problemId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
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
