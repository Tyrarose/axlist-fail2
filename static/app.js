const rulesList = document.getElementById('rules');

// Fetch all rules from the backend
async function fetchRules() {
    const response = await fetch('/get_rules');
    const rules = await response.json();
    renderRules(rules);
}

// Render rules to the DOM
function renderRules(rules) {
    rulesList.innerHTML = '';
    rules.forEach(rule => {
        const li = document.createElement('li');
        li.className = `rule-item ${rule.checked ? 'checked' : ''}`;
        li.innerHTML = `
            <span>${rule.rule}</span>
            <input type="checkbox" ${rule.checked ? 'checked' : ''} onchange="toggleRule('${rule.id}', this.checked)">
            <button onclick="deleteRule('${rule.id}')">Delete</button>
        `;
        rulesList.appendChild(li);
    });
}

// Add new rule
async function addRule() {
    const newRule = document.getElementById('newRule').value;
    await fetch('/add_rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule: newRule })
    });
    fetchRules();
}

// Toggle rule checked state
async function toggleRule(ruleId, checked) {
    await fetch(`/update_rule/${ruleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked: checked })
    });
    fetchRules();
}

// Delete rule
async function deleteRule(ruleId) {
    await fetch(`/delete_rule/${ruleId}`, { method: 'DELETE' });
    fetchRules();
}

// Reset all checks
async function resetChecks() {
    await fetch('/reset_checks', { method: 'POST' });
    fetchRules();
}

// Delete all rules
async function deleteAllRules() {
    await fetch('/delete_all', { method: 'DELETE' });
    fetchRules();
}

// Initial fetch
fetchRules();
