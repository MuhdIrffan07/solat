// Activate reminder-specific background image
document.body.classList.add('reminder-page');

const reminderInput = document.getElementById('reminderInput');
const saveBtn = document.getElementById('saveBtn');
const reminderList = document.getElementById('reminderList');

// Load existing reminders from localStorage when page opens
document.addEventListener('DOMContentLoaded', displayReminders);

// CREATE: Add a brand new reminder from the top form
saveBtn.addEventListener('click', () => {
    const reminderText = reminderInput.value.trim();

    if (!reminderText) {
        alert('Please enter a reminder description.');
        return;
    }

    let reminders = JSON.parse(localStorage.getItem('islamicReminders')) || [];

    // Add a unique ID based on the current timestamp
    reminders.push({ 
        id: Date.now().toString(), 
        text: reminderText, 
        date: new Date().toLocaleDateString() 
    });

    localStorage.setItem('islamicReminders', JSON.stringify(reminders));

    reminderInput.value = '';
    displayReminders();
});

// READ & DISPLAY: Render reminders with clean side-by-side buttons
function displayReminders() {
    let reminders = JSON.parse(localStorage.getItem('islamicReminders')) || [];

    if (reminders.length === 0) {
        reminderList.innerHTML = '<li style="padding: 10px; color: #9ca3af; background: transparent; border: none;">No reminders saved yet.</li>';
        return;
    }

    reminderList.innerHTML = '';
    
    reminders.forEach((reminder) => {
        const li = document.createElement('li');
        li.style.margin = '10px 0';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '14px 18px';
        li.style.background = 'rgba(255, 255, 255, 0.05)';
        li.style.border = '1px solid rgba(212, 175, 55, 0.15)';
        li.style.borderRadius = '10px';

        // Pass the reminder ID to the buttons instead of the array index
        li.innerHTML = `
            <div style="flex: 1; margin-right: 15px; word-break: break-word;">
                <span style="font-size: 1.05em; color: #fef9c3;">${reminder.text}</span>
                <br><small style="color: #9ca3af; margin-left: 22px;">Added: ${reminder.date}</small>
            </div>
            <div style="display: flex; gap: 8px; flex-shrink: 0;">
                <button onclick="inlineEdit('${reminder.id}')" style="background: #f59e0b; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.95em;">Edit</button>
                <button onclick="deleteReminder('${reminder.id}')" style="background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.95em;">Delete</button>
            </div>
        `;
        reminderList.appendChild(li);
    });
}

// UPDATE (INLINE ROW EDIT): Transform the list row into an input field when Edit is clicked
window.inlineEdit = function(id) {
    let reminders = JSON.parse(localStorage.getItem('islamicReminders')) || [];
    const reminder = reminders.find(r => r.id === id);
    
    // Find the specific LI element that holds this ID
    const buttons = document.querySelectorAll(`button[onclick="inlineEdit('${id}')"]`);
    if(buttons.length === 0) return;
    const targetLi = buttons[0].closest('li');

    targetLi.style.background = 'rgba(254, 243, 199, 0.15)';
    targetLi.innerHTML = `
        <div style="display: flex; gap: 10px; width: 100%; align-items: center;">
            <input type="text" id="editInput-${id}" value="${reminder.text}" style="flex: 1; padding: 10px 14px; border: 1px solid #d4af37; border-radius: 6px; font-size: 1.05em; outline: none; background: #ffffff; color: #041912;">
            <button onclick="saveInlineEdit('${id}')" style="background: #10b981; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">Save</button>
            <button onclick="displayReminders()" style="background: #6b7280; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">Cancel</button>
        </div>
    `;
    
    document.getElementById(`editInput-${id}`).focus();
};

// CUSTOM IN-APP MODAL CONFIRMATION HELPER
function showCustomModal(message, onConfirm) {
    const modal = document.getElementById('customModal');
    const messageEl = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    messageEl.textContent = message;
    modal.style.display = 'flex';

    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        onConfirm(true);
    });

    newCancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        onConfirm(false);
    });
}

// SAVE INLINE EDIT WITH CUSTOM EMERALD MODAL
window.saveInlineEdit = function(id) {
    const inputField = document.getElementById(`editInput-${id}`);
    const newText = inputField.value.trim();

    if (!newText) {
        alert('Reminder cannot be empty.');
        return;
    }

    showCustomModal('Are you sure you want to save these changes to this reminder?', (isConfirmed) => {
        if (!isConfirmed) return;

        let reminders = JSON.parse(localStorage.getItem('islamicReminders')) || [];
        // Find the exact index of the reminder with this ID
        let index = reminders.findIndex(r => r.id === id);
        
        if (index !== -1) {
            reminders[index].text = newText;
            reminders[index].date = new Date().toLocaleDateString();
            localStorage.setItem('islamicReminders', JSON.stringify(reminders));
        }
        
        displayReminders();
    });
};

// DELETE WITH CUSTOM EMERALD MODAL
window.deleteReminder = function(id) {
    showCustomModal('Are you sure you want to delete this reminder?', (isConfirmed) => {
        if (!isConfirmed) return;

        let reminders = JSON.parse(localStorage.getItem('islamicReminders')) || [];
        // Filter out the reminder that matches this ID
        reminders = reminders.filter(r => r.id !== id);
        
        localStorage.setItem('islamicReminders', JSON.stringify(reminders));
        displayReminders();
    });
};