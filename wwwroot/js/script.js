let step = 0;
const chatWindow = document.getElementById('chat-window');
const osOptions = document.getElementById('os-options');
const issueSelect = document.getElementById('issue-select');

document.getElementById('start-button').addEventListener('click', () => {
    step = 1;
    const issue = issueSelect.value;
    if (!issue) return;
    appendBotMessage(`Step 1: Is your Wi-Fi turned ON?`);
});

document.getElementById('next-button').addEventListener('click', () => {
    step++;
    handleNextStep();
});

function handleNextStep() {
    switch (step) {
        case 2:
            appendBotMessage(`Step 2: Can you see the 'LakeheadU' Wi-Fi network in the list?`);
            break;
        case 3:
            appendBotMessage(`Step 3: Are you using your Lakehead username and password to sign in?`);
            break;
        case 4:
            appendBotMessage(`Step 4: Please select your Operating System:`);
            osOptions.classList.remove('hidden');
            break;
        case 5:
            appendBotMessage(`Thanks! We’re processing your input.`);
            osOptions.classList.add('hidden');
            break;
        default:
            appendBotMessage(`No more steps.`);
    }
}

function selectOS(osName) {
    appendBotMessage(`You selected: ${osName}`);
    osOptions.classList.add('hidden');
}

function appendBotMessage(message) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>Bot:</strong> ${message}`;
    chatWindow.appendChild(p);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
