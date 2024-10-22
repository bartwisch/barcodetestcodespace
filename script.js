// Initialize QuaggaJS for barcode scanning
document.getElementById('start-scanning').addEventListener('click', function() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('barcode-frame'),
            constraints: {
                facingMode: "environment" // Use the rear camera
            },
        },
        decoder: {
            readers: ["code_128_reader"] // Specify the barcode type
        },
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        alert('Barcode detected: ' + data.codeResult.code);
        Quagga.stop(); // Stop scanning after detection
    });
});
