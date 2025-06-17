// DOM elements
const positionOptions = document.querySelectorAll('.position-option');
const saveBtn = document.getElementById('saveBtn');
const preview = document.getElementById('preview');

// State
let selectedPosition = 'bottom-center';

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    loadSavedPosition();
});

/**
 * Load saved position from chrome storage
 */
function loadSavedPosition() {
    chrome.storage.sync.get('snackbarPosition', (data) => {
        selectedPosition = data.snackbarPosition || 'bottom-center';
        updateSelection();
    });
}

/**
 * Update visual selection and show preview
 */
function updateSelection() {
    // Update selected state
    positionOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.position === selectedPosition) {
            option.classList.add('selected');
        }
    });

    // Show preview animation
    showPreview();
}

/**
 * Animate preview notification
 */
function showPreview() {
    preview.classList.remove('show');
    setTimeout(() => {
        preview.classList.add('show');
    }, 100);
}

/**
 * Save position to chrome storage
 */
function savePosition() {
    chrome.storage.sync.set({ snackbarPosition: selectedPosition }, () => {
        // Show success feedback
        showSaveSuccess();
    });
}

/**
 * Show save success animation
 */
function showSaveSuccess() {
    const originalText = saveBtn.textContent;

    // Update button state
    saveBtn.textContent = 'Saved!';
    saveBtn.classList.add('saved');

    // Reset after 2 seconds
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.classList.remove('saved');
    }, 2000);
}

// Event listeners
positionOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedPosition = option.dataset.position;
        updateSelection();
    });
});

saveBtn.addEventListener('click', savePosition);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('position-option')) {
        e.target.click();
    }
});

// Add accessibility attributes
positionOptions.forEach(option => {
    option.setAttribute('role', 'button');
    option.setAttribute('tabindex', '0');
    option.setAttribute('aria-label', `Select ${option.dataset.position.replace('-', ' ')} position`);
});