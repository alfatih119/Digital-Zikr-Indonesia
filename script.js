
// --- 1. DEFINISI ELEMEN DAN VARIABEL ---
const welcomeScreen = document.getElementById('welcome-screen');
const mainApp = document.getElementById('main-app');
const startButton = document.getElementById('start-btn');

const counterDisplay = document.getElementById('counter');
const countButton = document.getElementById('count-btn');
let count = 0;

const batteryLevelDisplay = document.getElementById('battery-level');
const batteryIcon = document.getElementById('battery-icon');

const bluetoothIcon = document.getElementById('bluetooth-icon');
const connectButton = document.getElementById('connect-btn');


// Variabel Long Press
let pressTimer;
let isLongPress = false;
const LONG_PRESS_TIME = 2000; // 1 detik


// --- 2. FUNGSI UTAMA TASBIH (HITUNG & RESET) ---

function incrementCount() {
    count++;
    counterDisplay.textContent = count;
}

function resetCount() {
    count = 0;
    counterDisplay.textContent = count;
    console.log("Tasbih direset!");
}

// Logika Tekan Lama (Long Press)
function startPress() {
    isLongPress = false;
    pressTimer = setTimeout(() => {
        isLongPress = true; // Tandai sebagai tekan lama
        resetCount();       // Jalankan reset
    }, LONG_PRESS_TIME);
}

function endPress() {
    clearTimeout(pressTimer); // Batalkan timer
    if (!isLongPress) {
        // Hanya hitung jika tombol dilepas sebelum 1 detik
        incrementCount();
    }
}

// Tambahkan Event Listener untuk Tombol Hitung
countButton.addEventListener('mousedown', startPress);
countButton.addEventListener('mouseup', endPress);
countButton.addEventListener('touchstart', startPress);
countButton.addEventListener('touchend', endPress);


// --- 3. FUNGSI WELCOME SCREEN ---

startButton.addEventListener('click', () => {
    // Sembunyikan welcome screen dan tampilkan main app
    welcomeScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    // Inisialisasi fitur setelah aplikasi utama tampil
    initBatteryStatus();
});


// --- 4. FUNGSI INDIKATOR BATERAI ---

function updateBatteryInfo(battery) {
    const level = Math.floor(battery.level * 100);
    batteryLevelDisplay.textContent = `${level}%`;

    // Atur ikon dan warna berdasarkan level
    if (battery.charging) {
        batteryIcon.textContent = '⚡'; // Sedang mengisi daya
        batteryIcon.style.color = '#007bff';
    } else if (level > 20) {
        batteryIcon.textContent = '🔋'; // Baterai penuh/normal
        batteryIcon.style.color = 'green';
    } else {
        batteryIcon.textContent = '🪫'; // Baterai lemah
        batteryIcon.style.color = 'red';
    }
}

function initBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryInfo(battery);
            // Tambahkan listener untuk perubahan status
            battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
            battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
        });
    } else {
        batteryLevelDisplay.textContent = 'N/A';
        batteryIcon.textContent = '❌';
        console.warn("Status Baterai tidak didukung.");
    }
}


// --- 5. FUNGSI KONEKSI BLUETOOTH ---

async function connectBluetooth() {
    try {
        bluetoothIcon.textContent = '⏳'; // Loading/Mencari
        connectButton.textContent = 'Mencari...';

        // Meminta browser untuk memilih perangkat Bluetooth
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true 
            // Jika Anda tahu ID service-nya, ganti dengan 'filters'
        });
        
        console.log('Terhubung ke perangkat:', device.name);
        bluetoothIcon.textContent = '✅'; // Berhasil terhubung
        connectButton.textContent = 'Tersambung';
        connectButton.disabled = true;

    } catch(error) {
        console.error('Koneksi Bluetooth Gagal:', error);
        bluetoothIcon.textContent = '❌'; // Gagal
        connectButton.textContent = 'Hubungkan';
        alert('Gagal terhubung. Pastikan Bluetooth aktif dan perangkat Anda terdekat.');
    }
}

connectButton.addEventListener('click', () => {
    if ('bluetooth' in navigator) {
        connectBluetooth();
    } else {
        alert('Fitur Web Bluetooth tidak didukung. Coba gunakan browser Chrome di perangkat Android atau Desktop.');
        bluetoothIcon.textContent = '❌';
    }
});


// --- INISIALISASI AWAL ---

// Pastikan hanya welcome screen yang terlihat saat pertama kali dibuka
welcomeScreen.classList.remove('hidden');
mainApp.classList.add('hidden');
