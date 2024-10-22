// Initialize QuaggaJS for barcode scanning
document.getElementById('start-scanning').addEventListener('click', function() {
    // Clear any previously detected barcodes
    document.getElementById('detected-barcode-list').innerHTML = '';
    displayStatus('Initializing barcode scanner...');

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('barcode-frame'),
            constraints: {
                facingMode: "environment", // Use the rear camera
                width: { min: 1280 }, // Increased minimum width for better resolution
                height: { min: 720 },  // Increased minimum height for better resolution
                aspectRatio: { min: 1, max: 100 }
            },
        },
        locator: {
            patchSize: "large", // Increased patch size for better detection
            halfSample: false
        },
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "i2of5_reader",
                "2of5_reader",
                "code_93_reader"
            ] // Expanded list of barcode types
        },
        numOfWorkers: navigator.hardwareConcurrency || 4, // Utilize available CPU cores
        locate: true,
        multiple: true, // Allow multiple barcodes to be detected continuously
        frequency: 10, // Set frequency of scans per second
        debug: {
            showCanvas: true,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatches: false
        }
    }, function(err) {
        if (err) {
            console.error('Quagga initialization error:', err);
            displayStatus('Error initializing barcode scanner.');
            return;
        }
        Quagga.start();
        displayStatus('Scanning started. Point your camera at a barcode.');
    });

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function(box) {
                    return box !== result.box;
                }).forEach(function(box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '#00F', lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(data) {
        const code = data.codeResult.code;
        console.log('Barcode detected:', code);

        // Add detected barcode to the list if not already present
        const barcodeList = document.getElementById('detected-barcode-list');
        if (![...barcodeList.children].some(item => item.textContent === code)) {
            const listItem = document.createElement('li');
            listItem.textContent = code;
            barcodeList.appendChild(listItem);
            displayStatus('Barcode detected: ' + code);
        }
    });

    Quagga.onError(function(err) {
        console.error('QuaggaJS error:', err);
        displayStatus('Barcode scanner encountered an error.');
    });
});

// Function to display status messages to the user
function displayStatus(message) {
    let statusElement = document.getElementById('status-message');
    if (!statusElement) {
        statusElement = document.createElement('p');
        statusElement.id = 'status-message';
        statusElement.style.marginTop = '10px';
        statusElement.style.color = '#00FF00';
        document.querySelector('.container').appendChild(statusElement);
    }
    statusElement.textContent = message;
}
