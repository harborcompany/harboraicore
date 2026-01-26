/**
 * HARBOR Mobile App - JavaScript
 * Data Contribution Platform
 * =======================================
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    currentOnboardingStep: 1,
    consents: {
        licensing: false,
        payouts: false,
        terms: false
    },
    isOnboarded: false,
    currentTab: 'home',
    captureMode: 'video',
    isCapturing: false,
    uploads: [],
    earnings: {
        available: 4.85,
        pending: 1.25,
        lifetime: 6.10,
        paidOut: 0
    },
    user: null
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Check if already onboarded
    const isOnboarded = localStorage.getItem('harbor_onboarded');

    if (isOnboarded) {
        state.isOnboarded = true;
        showMainApp();
    }

    // Setup event listeners
    setupNavigation();
    setupCaptureModes();
    setupFilterTabs();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// ONBOARDING FLOW
// ============================================

function nextOnboarding(step) {
    // Hide current step
    const currentStep = document.getElementById(`onboarding-${state.currentOnboardingStep}`);
    if (currentStep) {
        currentStep.style.display = 'none';
    }

    // Show next step
    const nextStep = document.getElementById(`onboarding-${step}`);
    if (nextStep) {
        nextStep.style.display = 'flex';
        state.currentOnboardingStep = step;

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function toggleConsent(element) {
    const consentType = element.dataset.consent;

    // Toggle the checked state
    element.classList.toggle('checked');
    state.consents[consentType] = element.classList.contains('checked');

    // Check if all consents are given
    const allConsented = Object.values(state.consents).every(v => v === true);
    const continueBtn = document.getElementById('consent-continue');

    if (continueBtn) {
        continueBtn.disabled = !allConsented;
    }
}

function completeOnboarding() {
    // Save onboarding state
    localStorage.setItem('harbor_onboarded', 'true');
    state.isOnboarded = true;

    // Show main app
    showMainApp();
}

function showMainApp() {
    // Hide all onboarding screens
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`onboarding-${i}`);
        if (step) {
            step.style.display = 'none';
        }
    }

    // Show main app
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.style.display = 'flex';
        mainApp.style.flexDirection = 'column';
        mainApp.style.flex = '1';
    }

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
}

function switchTab(tabId) {
    state.currentTab = tabId;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabId);
    });

    // Update tab views
    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.toggle('active', view.id === `tab-${tabId}`);
    });

    // Update header title
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
        const titles = {
            home: 'Home',
            capture: 'Capture',
            uploads: 'Uploads',
            earnings: 'Earnings',
            learn: 'Learn'
        };
        headerTitle.textContent = titles[tabId] || 'Harbor';
    }

    // Reinitialize icons for the new view
    if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 50);
    }
}

// ============================================
// CAPTURE FUNCTIONALITY
// ============================================

function setupCaptureModes() {
    const modeBtns = document.querySelectorAll('.capture-mode-btn');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            selectCaptureMode(mode);
        });
    });
}

function selectCaptureMode(mode) {
    state.captureMode = mode;

    // Update button states
    document.querySelectorAll('.capture-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update guided prompt visibility
    const guidedPrompt = document.getElementById('guided-prompt');
    if (guidedPrompt) {
        guidedPrompt.style.display = mode === 'guided' ? 'block' : 'none';
    }

    // Update capture preview
    updateCapturePreview(mode);
}

function updateCapturePreview(mode) {
    const preview = document.getElementById('capture-preview');
    if (!preview) return;

    const icons = {
        video: 'video',
        audio: 'mic',
        guided: 'camera'
    };

    const texts = {
        video: 'Tap to start recording video',
        audio: 'Tap to start recording audio',
        guided: 'Tap to start guided capture'
    };

    preview.innerHTML = `
        <div class="capture-placeholder">
            <i data-lucide="${icons[mode]}"></i>
            <p>${texts[mode]}</p>
        </div>
    `;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function startCapture() {
    const captureBtn = document.getElementById('capture-button');
    const preview = document.getElementById('capture-preview');

    if (state.isCapturing) {
        // Stop capturing
        state.isCapturing = false;
        captureBtn.innerHTML = '<i data-lucide="circle"></i>';
        captureBtn.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';

        // Simulate upload
        simulateUpload();
    } else {
        // Start capturing
        state.isCapturing = true;
        captureBtn.innerHTML = '<i data-lucide="square"></i>';
        captureBtn.style.background = '#EF4444';

        // Update preview
        if (preview) {
            preview.innerHTML = `
                <div class="capture-placeholder" style="color: #EF4444;">
                    <i data-lucide="radio" style="animation: pulse 1s infinite;"></i>
                    <p>Recording...</p>
                </div>
            `;
        }
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function simulateUpload() {
    // Add animation pulse style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);

    // Show processing state
    const preview = document.getElementById('capture-preview');
    if (preview) {
        preview.innerHTML = `
            <div class="capture-placeholder">
                <i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i>
                <p>Processing upload...</p>
            </div>
        `;

        // Add spin animation
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // After 2 seconds, show success
    setTimeout(() => {
        if (preview) {
            preview.innerHTML = `
                <div class="capture-placeholder" style="color: #22C55E;">
                    <i data-lucide="check-circle"></i>
                    <p>Upload complete! Now in review.</p>
                </div>
            `;
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reset after 2 more seconds
        setTimeout(() => {
            updateCapturePreview(state.captureMode);
        }, 2000);
    }, 2000);
}

function startGuidedCapture(type) {
    // Switch to capture tab with guided mode
    switchTab('capture');
    selectCaptureMode('guided');

    // Update guided prompt based on type
    const prompts = {
        walking: {
            title: '📍 Street Walking Video',
            description: 'Record a 30-60 second walking video outdoors.',
            checklist: [
                'Keep movement stable',
                'Natural daylight preferred',
                'No music or added audio',
                'Include surroundings in frame'
            ]
        },
        ambient: {
            title: '🎧 Indoor Ambient Audio',
            description: 'Record 60+ seconds of natural indoor sounds.',
            checklist: [
                'Find a quiet indoor space',
                'No music or talking',
                'Capture natural ambient sounds',
                'Hold device still'
            ]
        },
        product: {
            title: '📦 Product Handling Clip',
            description: 'Record 15-30 seconds of handling a product.',
            checklist: [
                'Good lighting (natural or lamp)',
                'Clean background',
                'Show product from multiple angles',
                'Steady movements'
            ]
        }
    };

    const prompt = prompts[type] || prompts.walking;
    const guidedPrompt = document.getElementById('guided-prompt');

    if (guidedPrompt) {
        guidedPrompt.innerHTML = `
            <h3>${prompt.title}</h3>
            <p>${prompt.description}</p>
            <ul class="guided-checklist">
                ${prompt.checklist.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }
}

function openGallery() {
    // In a real app, this would open the device gallery
    alert('Gallery picker would open here. Select photos/videos to upload.');
}

function switchCaptureMode() {
    const modes = ['video', 'audio', 'guided'];
    const currentIndex = modes.indexOf(state.captureMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    selectCaptureMode(nextMode);
}

// ============================================
// FILTER TABS
// ============================================

function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;

            // Update active state
            filterTabs.forEach(t => t.classList.toggle('active', t === tab));

            // Filter uploads (in a real app, this would filter the list)
            filterUploads(filter);
        });
    });
}

function filterUploads(filter) {
    const uploadItems = document.querySelectorAll('.upload-item');

    uploadItems.forEach(item => {
        const status = item.querySelector('.upload-status');
        const statusClass = status?.classList[1]; // e.g., 'approved', 'rejected', etc.

        if (filter === 'all') {
            item.style.display = 'flex';
        } else {
            item.style.display = statusClass === filter ? 'flex' : 'none';
        }
    });
}

// ============================================
// HEADER ACTIONS
// ============================================

function showNotifications() {
    alert('Notifications:\n\n• Upload approved: street_walk_001.mp4 (+£0.35)\n• New high-value category available\n• Tip: Watch "How to Film Stable Video"');
}

function showProfile() {
    alert('Profile & Settings\n\n• Account: contributor@email.com\n• Member since: January 2026\n• Total contributions: 12\n• Quality score: Above Average');
}

// ============================================
// LEARN CONTENT
// ============================================

function openLearnContent(contentId) {
    const content = {
        'how-harbor-works': {
            title: 'How Harbor Works',
            body: 'Harbor connects you with AI companies that need real-world audio and video data for training. You contribute content, we handle licensing, and you get paid when your data is used.\n\n1. Capture or upload content\n2. We review for quality\n3. Approved content enters the marketplace\n4. Earn money when licensed'
        },
        'licensing': {
            title: 'Understanding Licensing',
            body: 'When you contribute to Harbor, you grant limited usage rights while retaining ownership.\n\n• You keep copyright of your content\n• Harbor licenses it to verified AI companies\n• You can revoke access at any time\n• Payouts depend on license type and scope'
        },
        'stable-video': {
            title: 'How to Film Stable Video',
            body: 'Tips for stable footage:\n\n1. Hold your phone with both hands\n2. Keep elbows close to body\n3. Walk smoothly, heel-to-toe\n4. Avoid quick movements\n5. Use natural lighting when possible'
        },
        'clean-audio': {
            title: 'Recording Clean Audio',
            body: 'For high-quality audio:\n\n1. Find a quiet environment\n2. Avoid echo-y rooms\n3. Keep phone still while recording\n4. No background music\n5. Natural ambient sounds are good'
        },
        'high-value': {
            title: 'What Data Pays More',
            body: 'Higher-paying content:\n\n• Rare environments (factories, farms)\n• Diverse demographics\n• Unique activities\n• High-quality 4K video\n• Clear, no-noise audio\n• Content we specifically request'
        }
    };

    const item = content[contentId];
    if (item) {
        alert(`${item.title}\n\n${item.body}`);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function resetOnboarding() {
    localStorage.removeItem('harbor_onboarded');
    location.reload();
}

// Expose functions globally
window.nextOnboarding = nextOnboarding;
window.toggleConsent = toggleConsent;
window.completeOnboarding = completeOnboarding;
window.switchTab = switchTab;
window.startCapture = startCapture;
window.startGuidedCapture = startGuidedCapture;
window.openGallery = openGallery;
window.switchCaptureMode = switchCaptureMode;
window.showNotifications = showNotifications;
window.showProfile = showProfile;
window.openLearnContent = openLearnContent;
window.resetOnboarding = resetOnboarding;
