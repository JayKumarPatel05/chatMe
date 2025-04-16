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

    document.getElementById('os-options').classList.add('hidden');

    if (currentStep < steps.length) {
        const step = steps[currentStep];

        // Custom logic per issue
        switch (selectedIssue) {
            case "Wifi not working":
                renderDefaultStep(step); // render step first
                handleWifiSupport(step);
                break;
            case "Printing services":
                renderDefaultStep(step);
                handlePrintSupport(step);
                break;
            case "VPN Services":
                handleVpnSupport(step); // Don't render default here
                break;
            default:
                renderDefaultStep(step); // Fallback
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
    const chatWindow = document.getElementById('chat-window');

    if (currentStep === 0) {
        const botIntro = document.createElement('p');
        botIntro.innerHTML = `<strong>Bot:</strong> Step 1: Download FortiClient VPN for your device:`;
        chatWindow.appendChild(botIntro);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('vpn-grid');

        const platforms = [
            { name: "Windows", url: "https://links.fortinet.com/forticlient/win/vpnagent", icon: "/images/windows.jpg", key: "windows" },
            { name: "Mac", url: "https://links.fortinet.com/forticlient/mac/vpnagent", icon: "/images/mac.jpg", key: "mac" },
            { name: "Android", url: "https://play.google.com/store/apps/details?id=com.fortinet.forticlient_vpn", icon: "/images/android.jpg", key: "android" },
            { name: "iOS", url: "https://apps.apple.com/us/app/forticlient-vpn/id1475674905", icon: "/images/ios.jpg", key: "ios" },
            { name: "Linux (.RPM)", url: "https://links.fortinet.com/forticlient/rhel/vpnagent", icon: "/images/rpm.jpg" },
            { name: "Linux (.DEB)", url: "https://links.fortinet.com/forticlient/deb/vpnagent", icon: "/images/deb.jpg" },
        ];

        platforms.forEach(platform => {
            const link = document.createElement('a');
            link.href = platform.url;
            link.target = "_blank";
            link.className = "vpn-btn";
            link.innerHTML = `<img src="${platform.icon}" alt="${platform.name} logo" class="vpn-logo"> ${platform.name}`;

            // If steps exist for this platform, also attach click handler
            if (platform.key) {
                link.addEventListener('click', () => showVpnSteps(platform.key));
            }

            buttonContainer.appendChild(link);
        });

        chatWindow.appendChild(buttonContainer);
        return; // Skip default step rendering
    }

    // Final step: show help options if needed
    if (currentStep === issueData[selectedIssue].length - 1 && step.toLowerCase().includes("still need help")) {
        showHelpOptions();
    }
}


function showVpnSteps(os) {
    const chatWindow = document.getElementById('chat-window');

    const steps = {
        windows: [
            "Step 1: Click on FortiClient desktop icon to launch software.",
            "Step 2: Click on \"Config VPN\" to add a VPN connection.",
            "Step 3: Select \"SSL-VPN\" at the top of the box.",
            "Step 4: Enter the settings in each field as shown below and click apply:",
            "• Connection Name: LU SSL",
            "• Description: (Optional)",
            "• Remote Gateway: vpn.lakeheadu.ca",
            "• Check the box beside 'Customize Port'",
            "• Port Number: 10443",
            "Step 5: Enter your Lakehead Username & Password and click \"Connect\".",
            "Note: For version 7, if you receive a security alert saying 'a secure connection cannot be verified', click \"Yes\" to continue."
        ],
        mac: [
            "Step 1: Click on FortiClient desktop icon to launch software.",
            "Step 2: Click on \"Config VPN\" to add a VPN connection.",
            "Step 3: Select \"SSL-VPN\" at the top of the box.",
            "Step 4: Enter the settings in each field as shown below and click apply:",
            "• Connection Name: LU SSL",
            "• Description: (Optional)",
            "• Remote Gateway: vpn.lakeheadu.ca",
            "• Check the box beside 'Customize Port'",
            "• Port Number: 10443",
            "Step 5: Enter your Lakehead Username & Password and click \"Connect\".",
            "Note: For version 7, if you receive a security alert saying 'a secure connection cannot be verified', click \"Yes\" to continue."
        ],
        android: [
            "Step 1: Tap FortiClient to launch app.",
            "Step 2: Tap 'New VPN' on the lower left corner.",
            "Step 3: Enter VPN name, select SSL VPN, then tap 'Create'.",
            "Step 4: Tap 'Server Settings'.",
            "Step 5: Enter the following setting:",
            "• FortiGate Server Address: vpn.lakeheadu.ca"
        ],
        ios: [
            "Step 1: Download the FortiClient app from the App Store.",
            "Step 2: When you first open the app, tap 'I accept'.",
            "Step 3: On the next screen, tap 'OK, got it'.",
            "Step 4: When prompted, tap 'Allow' to grant permission.",
            "Step 5: Enter your iOS device passcode.",
            "Step 6: Tap 'Select connection >'.",
            "Step 7: Enter the following VPN settings:",
            "• Name: LakeheadU",
            "• Host: 69.39.0.1",
            "• Port: 10443",
            "• Username: Your Lakehead Username",
            "Step 8: Tap 'OK'.",
            "Step 9: Enter your Username & Password and tap 'OK' to connect."
        ]
    };

    steps[os]?.forEach(text => {
        const botMsg = document.createElement('p');
        if (text.trim().startsWith("•")) {
            botMsg.innerHTML = `&emsp;${text}`; // indent without 'Bot:'
        } else {
            botMsg.innerHTML = `<strong>Bot:</strong> ${text}`;
        }
        chatWindow.appendChild(botMsg);
    });
}


function renderDefaultStep(step) {
    const chatWindow = document.getElementById('chat-window');
    const botMsg = document.createElement('p');
    const linkedStep = step.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    botMsg.innerHTML = `<strong>Bot:</strong> ${linkedStep}`;
    chatWindow.appendChild(botMsg);
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
