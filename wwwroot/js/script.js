let currentStep = 0;
let selectedIssue = "";
let issueData = {};

document.getElementById('start-button').addEventListener('click', async function () {
    selectedIssue = document.getElementById('issue-select').value;

    if (!selectedIssue) {
        alert("Please select an issue.");
        return;
    }

    const response = await fetch('/js/issues.json?v=' + new Date().getTime());
    issueData = await response.json();

    if (!issueData[selectedIssue]) {
        alert("Steps for this issue are not available.");
        return;
    }

    currentStep = 0;
    displayStep();
});

document.getElementById('next-button').addEventListener('click', function () {
    currentStep++;
    displayStep();
});

function displayStep() {
    const chatWindow = document.getElementById('chat-window');
    const steps = issueData[selectedIssue];

    // Always hide OS buttons unless shown
    document.getElementById('os-options').classList.add('hidden');

    if (currentStep < steps.length) {
        const step = steps[currentStep];
        const botMsg = document.createElement('p');
        const linkedStep = step.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        botMsg.innerHTML = `<strong>Bot:</strong> ${linkedStep}`;
        chatWindow.appendChild(botMsg);

        // Dispatch support logic to appropriate handler
        switch (selectedIssue) {
            case "Wifi not working":
                handleWifiSupport(step);
                break;
            case "Printing services":
                handlePrintSupport(step);
                break;
            case "VPN Services":
                handleVpnSupport(step);
                break;
        }
    }
}
function handleWifiSupport(step) {
    if (currentStep === 3) {
        document.getElementById('os-options').classList.remove('hidden');
    }

    if (currentStep === issueData[selectedIssue].length - 1 && step.includes("Step 5: Need more help?")) {
        showHelpOptions();
    }
}

function handlePrintSupport(step) {
    if (currentStep === issueData[selectedIssue].length - 1 && step.includes("Step 5: If you're still unable to print")) {
        showHelpOptions();
    }
}

function handleVpnSupport(step) {
    // You can add custom logic for VPN support here in future.
    // For now, just reuse the Help Options if the last step includes something similar.
    if (currentStep === issueData[selectedIssue].length - 1 && step.toLowerCase().includes("still need help")) {
        showHelpOptions();
    }
}

function showHelpOptions() {
    const chatWindow = document.getElementById('chat-window');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = "help-options";

    const visitBtn = document.createElement('button');
    visitBtn.id = "visit-btn";
    visitBtn.textContent = "Visit Room LI 1015";

    const ticketBtn = document.createElement('button');
    ticketBtn.id = "ticket-btn";
    ticketBtn.textContent = "Create a Ticket";

    buttonContainer.appendChild(visitBtn);
    buttonContainer.appendChild(ticketBtn);
    chatWindow.appendChild(buttonContainer);

    visitBtn.addEventListener('click', function () {
        const visitInfo = document.createElement('div');
        visitInfo.innerHTML = `You can visit us in person for assistance: <br>
                               Location: Chancellor Paterson Library, Room LI 1015 (Main Floor) <br>
                               Hours: Monday to Friday, 8:00 AM – 4:00 PM <br>
                               Phone: 807-346-7777`;
        chatWindow.appendChild(visitInfo);
    });

    ticketBtn.addEventListener('click', function () {
        const ticketInfo = document.createElement('div');
        ticketInfo.innerHTML = `
            <p><strong>Bot:</strong> You chose to create a support ticket. Redirecting you to the ticket page in 5 seconds...</p>
            <div role="note" aria-label="Ticket Submission Note" class="ticket-note">
                <p><strong>📌 Important:</strong> Please submit your request in the <strong>Helpdesk</strong> queue when filling out the ticket.</p>
                <p><strong>🚫 Do not create multiple tickets</strong> for the same issue — this can delay our response time.</p>
            </div>
        `;
        chatWindow.appendChild(ticketInfo);

        setTimeout(() => {
            window.open('https://rt.lakeheadu.ca/SelfService/CreateTicketInQueue.html', '_blank');
        }, 5000);
    });
}
