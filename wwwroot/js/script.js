let currentStep = 0;
let selectedIssue = "";
let issueData = {};

document.getElementById('start-button').addEventListener('click', async function () {
    selectedIssue = document.getElementById('issue-select').value;

    if (!selectedIssue) {
        alert("Please select an issue.");
        return;
    }

    // Load the JSON file
    const response = await fetch('/js/issues.json?v=' + new Date().getTime());
    issueData = await response.json();

    if (!issueData[selectedIssue]) {
        alert("Steps for this issue are not available.");
        return;
    }

    currentStep = 0;
    document.getElementById('chat-window').innerHTML = '';
    displayStep();
});

document.getElementById('next-button').addEventListener('click', function () {
    currentStep++;
    displayStep();
});

function displayStep() {
    const chatWindow = document.getElementById('chat-window');
    const steps = issueData[selectedIssue];

    // Always hide OS buttons unless shown by a step
    document.getElementById('os-options').classList.add('hidden');

    if (currentStep < steps.length) {
        const step = steps[currentStep];
        chatWindow.innerHTML += `<p><strong>Bot:</strong> ${step}</p>`;

        // Show OS options on specific step
        if (step.toLowerCase().includes("select your operating system")) {
            document.getElementById('os-options').classList.remove('hidden');
        }
    } else {
        // Final support step after all guidance is done
        if (selectedIssue === "Wifi not working") {
            const choice = window.confirm(
                "Are you still unable to connect?\n\nClick OK to create a support ticket, or Cancel to visit us in person at Room LI 1015."
            );

            if (choice) {
                // OK clicked – open ticket page(S)
                window.open('https://rt.lakeheadu.ca/SelfService/CreateTicketInQueue.html', '_blank');
                chatWindow.innerHTML += `
                                            <p><strong>Bot:</strong> You chose to create a support ticket. Redirecting you to the ticket page...</p>
                                            <div role="note" aria-label="Ticket Submission Note" class="ticket-note">
                                                <p><strong>📌 Important:</strong> Please submit your request in the <strong>Helpdesk</strong> queue when filling out the ticket.</p>
                                                <p><strong>🚫 Do not create multiple tickets</strong> for the same issue — this can delay our response time.</p>
                                            </div>
                                        `
                ;
            } else {
                // Cancel clicked – show detailed visit info
                chatWindow.innerHTML += `
                    <p><strong>Bot:</strong> You can visit us in person for assistance:</p>
                    <ul>
                        <li><strong>Location:</strong> Chancellor Paterson Library, Room LI 1015 (Main Floor)</li>
                        <li><strong>Hours:</strong> Monday to Friday, 8:00 AM – 4:00 PM</li>
                        <li><strong>Phone:</strong> 807-346-7777</li>
                    </ul>
                `;
            }
        } else {
            chatWindow.innerHTML += `<p><strong>Bot:</strong> End of steps.</p>`;
        }
    }
}




// Event listeners for the new options (ticket creation or visiting the help desk)
document.getElementById('visit-btn').addEventListener('click', function () {
    window.open('https://www.lakeheadu.ca/faculty-and-staff/departments/services/helpdesk/contact', '_blank');
});

document.getElementById('ticket-btn').addEventListener('click', function () {
    window.open('https://www.lakeheadu.ca/faculty-and-staff/departments/services/helpdesk/ticket-creation', '_blank');
});
