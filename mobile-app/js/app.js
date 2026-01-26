/**
 * Kled Mobile App - JavaScript
 * Data contribution platform for earning from uploads
 */

// State management
const state = {
    currentTab: 'upload',
    uploadProgress: 0,
    completedUploads: 3,
    isUploading: false,
    uploads: [
        { id: 1, name: 'IMG_2847.jpg', size: '2.4 MB', time: '2 hours ago', status: 'pending' },
        { id: 2, name: 'IMG_2846.jpg', size: '1.8 MB', time: '3 hours ago', status: 'approved' },
        { id: 3, name: 'IMG_2845.jpg', size: '3.1 MB', time: 'Yesterday', status: 'paid' }
    ],
    wallet: {
        balance: 0.00,
        pending: 3
    },
    stats: {
        totalUploads: 24,
        earnings: 0.72,
        avgPerImage: 0.03
    }
};

// DOM Elements
const elements = {
    tabViews: document.querySelectorAll('.tab-view'),
    navItems: document.querySelectorAll('.nav-item'),
    uploadDial: document.getElementById('upload-dial'),
    uploadModal: document.getElementById('upload-modal'),
    progressCircle: document.getElementById('progress-circle'),
    progressText: document.getElementById('progress-text'),
    statusBar: document.getElementById('status-bar'),
    fileInput: document.getElementById('file-input'),
    segmentBtns: document.querySelectorAll('.segment-btn')
};

// Initialize app
function initApp() {
    setupNavigation();
    setupUploadDial();
    setupSegmentedControls();
    setupFileInput();
    updateStatusBar();
}

// Tab Navigation
function setupNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    state.currentTab = tabId;
    
    // Update nav items
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabId);
    });
    
    // Update tab views
    elements.tabViews.forEach(view => {
        view.classList.toggle('active', view.id === `tab-${tabId}`);
    });
    
    // Show/hide status bar based on tab
    if (tabId === 'upload' && state.completedUploads > 0) {
        elements.statusBar.style.display = 'flex';
    } else {
        elements.statusBar.style.display = 'none';
    }
}

// Upload Dial
function setupUploadDial() {
    elements.uploadDial.addEventListener('click', () => {
        if (!state.isUploading) {
            openUploadModal();
        }
    });
}

function openUploadModal() {
    elements.uploadModal.classList.add('active');
}

function closeUploadModal() {
    elements.uploadModal.classList.remove('active');
}

// File selection
function setupFileInput() {
    elements.fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            closeUploadModal();
            simulateUpload(files);
        }
    });
}

function selectFromLibrary() {
    elements.fileInput.click();
}

function openCamera() {
    // On mobile, this would open camera
    // For demo, just open file picker
    elements.fileInput.click();
}

// Upload simulation
function simulateUpload(files) {
    state.isUploading = true;
    state.uploadProgress = 0;
    
    const progressCircle = elements.progressCircle;
    const circumference = 2 * Math.PI * 100; // r=100
    
    // Animate progress
    const interval = setInterval(() => {
        state.uploadProgress += Math.random() * 15;
        
        if (state.uploadProgress >= 100) {
            state.uploadProgress = 100;
            clearInterval(interval);
            
            // Complete upload
            setTimeout(() => {
                completeUpload(files);
            }, 500);
        }
        
        updateProgressRing(state.uploadProgress, circumference);
    }, 200);
}

function updateProgressRing(progress, circumference) {
    const offset = circumference - (progress / 100) * circumference;
    elements.progressCircle.style.strokeDashoffset = offset;
    elements.progressText.textContent = `${Math.round(progress)}%`;
    
    // Add glow effect when progressing
    if (progress > 0 && progress < 100) {
        elements.uploadDial.parentElement.classList.add('uploading');
    }
}

function completeUpload(files) {
    state.isUploading = false;
    state.completedUploads += files.length;
    
    // Add to uploads list
    for (let i = 0; i < files.length; i++) {
        state.uploads.unshift({
            id: Date.now() + i,
            name: files[i].name,
            size: formatFileSize(files[i].size),
            time: 'Just now',
            status: 'pending'
        });
    }
    
    // Update UI
    updateStatusBar();
    updateUploadsList();
    
    // Reset progress after delay
    setTimeout(() => {
        state.uploadProgress = 0;
        updateProgressRing(0, 2 * Math.PI * 100);
        elements.progressText.textContent = '0%';
    }, 2000);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Status bar
function updateStatusBar() {
    const countEl = document.getElementById('completed-count');
    if (countEl) {
        countEl.textContent = state.completedUploads;
    }
    
    if (state.currentTab === 'upload' && state.completedUploads > 0) {
        elements.statusBar.style.display = 'flex';
    }
}

function clearCompleted() {
    state.completedUploads = 0;
    elements.statusBar.style.display = 'none';
}

// Uploads list
function updateUploadsList() {
    const listEl = document.getElementById('uploads-list');
    if (!listEl) return;
    
    listEl.innerHTML = state.uploads.map(upload => `
        <div class="upload-item">
            <div class="upload-thumb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
            <div class="upload-info">
                <div class="upload-name">${upload.name}</div>
                <div class="upload-meta">${upload.time} • ${upload.size}</div>
            </div>
            <span class="upload-status ${upload.status}">${capitalizeFirst(upload.status)}</span>
        </div>
    `).join('');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Segmented controls
function setupSegmentedControls() {
    elements.segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            parent.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Handle segment change
            const segment = btn.dataset.segment || btn.dataset.walletTab;
            handleSegmentChange(segment);
        });
    });
}

function handleSegmentChange(segment) {
    // Could filter uploads or wallet history based on segment
    console.log('Segment changed:', segment);
}

// Window functions (called from HTML)
window.switchTab = switchTab;
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.selectFromLibrary = selectFromLibrary;
window.openCamera = openCamera;
window.clearCompleted = clearCompleted;

// Close modal on backdrop click
elements.uploadModal?.addEventListener('click', (e) => {
    if (e.target === elements.uploadModal) {
        closeUploadModal();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
