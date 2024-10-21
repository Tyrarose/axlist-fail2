const rulesList = document.getElementById('rules');

// Fetch all rules from the backend
async function fetchRules() {
    try {
        const response = await fetch('/get_rules');
        if (!response.ok) throw new Error('Failed to fetch rules');
        const rules = await response.json();
        renderRules(rules);
    } catch (error) {
        console.error('Error fetching rules:', error);
        // Optionally display an error message to the user
    }
}

// Render rules to the DOM
function renderRules(rules) {
    rulesList.innerHTML = ''; // Clear existing rules
    rules.forEach(rule => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.id = `rule-${rule.id}`;  // Correctly use backticks for the id

        // Use backticks for multi-line template literal
        li.innerHTML = `
            <input type="checkbox" class="custom-checkbox" id="checkbox-${rule.id}" ${rule.checked ? 'checked' : ''} onchange="toggleRule('${rule.id}', this.checked)">
            <label class="checkbox-label ${rule.checked ? 'checked' : ''}" for="checkbox-${rule.id}">${rule.rule}</label>
            <button onclick="deleteRule('${rule.id}')" class="btn btn-danger btn-sm">🗑️</button>
        `;

        rulesList.appendChild(li);
    });
}


// Add new rule
async function addRule() {
    const newRule = document.getElementById('new_rule').value; // Ensure this matches your input field's ID
    if (newRule.trim() === '') {
        alert('Please enter a rule.');
        return; // Prevent adding empty rules
    }

    try {
        const response = await fetch('/add_rule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_rule: newRule }) // Ensure this matches your server's expected key
        });
        if (!response.ok) throw new Error('Failed to add rule');
        
        document.getElementById('new_rule').value = ''; // Clear input field
        fetchRules(); // Refresh the rules list
    } catch (error) {
        console.error('Error adding rule:', error);
    }
}

// Toggle rule checked state
async function toggleRule(ruleId, checked) {
    try {
        const response = await fetch(/toggle_rule/${ruleId}, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ checked: checked })
        });

        if (response.ok) {
            const label = document.querySelector(label[for="checkbox-${ruleId}"]);
            if (checked) {
                label.classList.add('checked'); // Add strikethrough if checked
            } else {
                label.classList.remove('checked'); // Remove strikethrough if unchecked
            }
        }
    } catch (error) {
        console.error('Error toggling rule:', error);
    }
}


// Delete rule
async function deleteRule(ruleId) {
    try {
        const response = await fetch(/delete_rule/${ruleId}, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to delete rule');
        
        fetchRules(); // Refresh the rules list
    } catch (error) {
        console.error('Error deleting rule:', error);
    }
}

// Reset all checks
async function resetChecks() {
    try {
        const response = await fetch('/reset_rules', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to reset checks');
        
        fetchRules(); // Refresh the rules list
    } catch (error) {
        console.error('Error resetting checks:', error);
    }
}

// Delete all rules
async function deleteAllRules() {
    try {
        const response = await fetch('/delete_all', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to delete all rules');
        
        fetchRules(); // Refresh the rules list
    } catch (error) {
        console.error('Error deleting all rules:', error);
    }
}

// Initial fetch
fetchRules();