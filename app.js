/**
 * NequiGlitch PWA - App Logic
 * Router + PIN logic + Home interactions
 */

'use strict';

// ─── STATE ───────────────────────────────────────────────────────────────────
const State = {
    currentPage: 'page-inicial',
    phone: '',
    pin: '',
    pinTarget: '0000',       // PIN de prueba — en producción viene del servidor
    saldoVisible: false,
    saldo: '$ 1.250.000,00',
    saldoTotal: 'Total $ 1.250.000,00',
    username: 'USERPASSNEQUI',
};

// ─── ROUTER ──────────────────────────────────────────────────────────────────
const Router = {
    navigate(toId, direction = 'forward') {
        const from = document.getElementById(State.currentPage);
        const to = document.getElementById(toId);
        if (!to || State.currentPage === toId) return;

        const outClass = direction === 'forward' ? 'slide-out' : 'slide-back-out';
        const inClass = direction === 'forward' ? 'slide-in' : 'slide-back-in';

        // Show destination first (below/behind)
        to.style.display = 'flex';
        to.style.flexDirection = 'column';

        // Animate out
        from.classList.add(outClass);

        // After from finishes going out, hide it
        from.addEventListener('animationend', () => {
            from.classList.remove('active', outClass);
            from.style.display = '';
        }, { once: true });

        // Animate in
        to.classList.add('active', inClass);
        to.addEventListener('animationend', () => {
            to.classList.remove(inClass);
        }, { once: true });

        State.currentPage = toId;
    },
};

// ─── APP ─────────────────────────────────────────────────────────────────────
const App = {

    // ── InicialPage ──────────────────────────────────────────────────────────
    goToClave() {
        const input = document.getElementById('phone-input');
        const phone = input ? input.value.replace(/\D/g, '') : '';

        if (phone.length !== 10) {
            input.focus();
            // Shake animation
            const row = input.closest('.phone-input-row');
            row.style.animation = 'none';
            row.offsetHeight; // reflow
            row.style.animation = 'shake 0.4s ease';
            return;
        }

        State.phone = phone;
        State.username = `+57 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
        document.getElementById('home-username').textContent = State.username;
        Router.navigate('page-clave');
        this.resetPin();
    },

    // ── ClavePage ────────────────────────────────────────────────────────────
    resetPin() {
        State.pin = '';
        this._updatePinDisplay();
    },

    addPinDigit(digit) {
        if (State.pin.length >= 4) return;
        State.pin += digit;
        this._updatePinDisplay();

        if (State.pin.length === 4) {
            setTimeout(() => this._validatePin(), 200);
        }
    },

    deletePinDigit() {
        if (State.pin.length === 0) return;
        State.pin = State.pin.slice(0, -1);
        this._updatePinDisplay();
    },

    _updatePinDisplay() {
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById(`pin-c${i}`);
            if (!el) continue;
            el.classList.toggle('filled', i <= State.pin.length);
            el.textContent = i <= State.pin.length ? '●' : '';
        }
    },

    _validatePin() {
        if (State.pin === State.pinTarget || State.pin.length === 4) {
            // For demo: any 4-digit PIN works
            Router.navigate('page-home');
            this.resetPin();
        } else {
            // Shake error
            const display = document.getElementById('pin-display');
            display.classList.remove('shake');
            display.offsetHeight;
            display.classList.add('shake');
            display.addEventListener('animationend', () => {
                display.classList.remove('shake');
                this.resetPin();
            }, { once: true });
        }
    },

    // ── HomeNequi ────────────────────────────────────────────────────────────
    toggleSaldo() {
        State.saldoVisible = !State.saldoVisible;
        const amount = document.getElementById('saldo-amount');
        const total = document.getElementById('saldo-total');
        const icon = document.getElementById('eye-icon');

        if (State.saldoVisible) {
            amount.textContent = State.saldo;
            total.textContent = State.saldoTotal;
            // Open eye icon
            icon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.5"/>
      `;
        } else {
            amount.textContent = '$ ****,00';
            total.textContent = 'Total $ ****,00';
            // Closed eye icon
            icon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      `;
        }
    },

    setNavTab(tab, btn) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('nav-item--active'));
        btn.classList.add('nav-item--active');
        // In a full app, this would switch sub-views
    },

    copyClave() {
        const val = document.getElementById('clave-valor');
        if (!val) return;
        const code = val.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                const btn = document.querySelector('.clave-copy-btn');
                if (btn) {
                    btn.style.opacity = '0.4';
                    setTimeout(() => { btn.style.opacity = ''; }, 600);
                }
            }).catch(() => { });
        }
    },

    noop() {
        // Placeholder for future functionality
    },
};

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // === InicialPage: phone input ===
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
        phoneInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') App.goToClave();
        });
    }

    // === ClavePage: keypad ===
    const keypad = document.getElementById('keypad');
    if (keypad) {
        keypad.addEventListener('click', (e) => {
            const btn = e.target.closest('.key-btn');
            if (!btn) return;

            if (btn.id === 'key-delete') {
                App.deletePinDigit();
            } else {
                const digit = btn.dataset.key;
                if (digit !== undefined) App.addPinDigit(digit);
            }
        });
    }

    // === Service Worker ===
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(r => console.log('[App] SW registrado:', r.scope))
            .catch(e => console.warn('[App] SW error:', e));
    }

    // === Install prompt ===
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        console.log('[App] App instalable detectedada');
    });

    console.log('[NequiGlitch] App iniciada ✓');
});
