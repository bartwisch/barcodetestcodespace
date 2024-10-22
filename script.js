const startButton = document.getElementById('start-btn');
const closeButton = document.getElementById('close-btn');
const scannerContainer = document.getElementById('scanner-container');
let html5Qrcode;

startButton.addEventListener('click', startScanning);
closeButton.addEventListener('click', () => window.close());

async function startScanning() {
    const scannerWidth = scannerContainer.offsetWidth;
    const qrboxSize = Math.floor(scannerWidth * 0.8); // 80% of the scanner width

    html5Qrcode = new Html5Qrcode("scanner-container");
    
    try {
        await html5Qrcode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: qrboxSize,
                supportedFormats: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E
                ]
            },
            onScanSuccess,
            onScanError
        );
        startButton.style.display = 'none';
    } catch (err) {
        console.error(`Fehler beim Starten des Scanners: ${err}`);
    }
}

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Barcode-Inhalt: ${decodedText}`, decodedResult);
    alert(`Barcode gescannt: ${decodedText}`);
    stopScanning();
}

function onScanError(error) {
    console.warn(`Scan-Fehler: ${error}`);
}

function stopScanning() {
    if (html5Qrcode) {
        html5Qrcode.stop().then(() => {
            startButton.style.display = 'block';
        }).catch((err) => {
            console.error(`Fehler beim Stoppen des Scanners: ${err}`);
        });
    }
}

// Funktion zum Neuberechnen der qrbox-Größe bei Fenstergrößenänderungen
function handleResize() {
    if (html5Qrcode) {
        stopScanning();
        startScanning();
    }
}

// Event-Listener für Fenstergrößenänderungen
window.addEventListener('resize', handleResize);
