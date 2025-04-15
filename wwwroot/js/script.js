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

    // Always hide OS buttons unless shown by a step
    document.getElementById('os-options').classList.add('hidden');

    if (currentStep < steps.length) {
        const step = steps[currentStep];

        const botMsg = document.createElement('p');
        botMsg.innerHTML = `<strong>Bot:</strong> ${step}`;
        chatWindow.appendChild(botMsg);

        // Show OS options for Wi-Fi Step 4 (index 3)
        if (selectedIssue === "Wifi not working" && currentStep === 3) {
            document.getElementById('os-options').classList.remove('hidden');
        }

        // For Printing Services, show "Need more help?" and buttons in Step 5
        if (selectedIssue === "Printing services" && currentStep === steps.length - 1 && step === "Step 5: If you're still unable to print, please choose one of the options below for further assistance:") {
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

            // Event listener for Visit button
            visitBtn.addEventListener('click', function () {
                const visitInfo = document.createElement('div');
                visitInfo.innerHTML = `You can visit us in person for assistance: <br>
                                       Location: Chancellor Paterson Library, Room LI 1015 (Main Floor) <br>
                                       Hours: Monday to Friday, 8:00 AM – 4:00 PM <br>
                                       Phone: 807-346-7777`;
                chatWindow.appendChild(visitInfo);
            });

            // Event listener for Ticket button
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

                // Wait 5 seconds before opening the ticket page
                setTimeout(() => {
                    window.open('https://rt.lakeheadu.ca/SelfService/CreateTicketInQueue.html', '_blank');
                }, 5000);
            });

        }

        // If this is the last step for Wi-Fi, show "Need more help?" message and the buttons
        if (selectedIssue === "Wifi not working" && currentStep === steps.length - 1 && step === "Step 5: Need more help?") {
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

            // Event listener for Visit button
            visitBtn.addEventListener('click', function () {
                const visitInfo = document.createElement('div');
                visitInfo.innerHTML = `You can visit us in person for assistance: <br>
                                       Location: Chancellor Paterson Library, Room LI 1015 (Main Floor) <br>
                                       Hours: Monday to Friday, 8:00 AM – 4:00 PM <br>
                                       Phone: 807-346-7777`;
                chatWindow.appendChild(visitInfo);
            });

            // Event listener for Ticket button
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

                // Wait 5 seconds before opening the ticket page
                setTimeout(() => {
                    window.open('https://rt.lakeheadu.ca/SelfService/CreateTicketInQueue.html', '_blank');
                }, 5000);
            });

        }
    }
}
