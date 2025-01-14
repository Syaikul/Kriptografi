let publicKey = null;
let privateKey = null;

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(e, phi) {
    for (let d = 1; d < phi; d++) {
        if ((e * d) % phi === 1) return d;
    }
    return null;
}

function generateKeys() {
    const p = parseInt(document.getElementById("p").value);
    const q = parseInt(document.getElementById("q").value);
    const e = parseInt(document.getElementById("e").value);
    if (!p || !q ) {
        alert("Anda harus menginputkan nilai untuk p and q.");
        return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    if (gcd(e, phi) !== 1) {
        alert("Nilai e harus sama dengan φ(n).");
        return;
    }

    const d = modInverse(e, phi);

    publicKey = {e, n};
    privateKey = {d, n};

    document.getElementById("key-info").innerText = `Public Key: (e=${e}, n=${n})\nPrivate Key: (d=${d}, n=${n})`;
}

function showHint() {
    const p = parseInt(document.getElementById("p").value);
    const q = parseInt(document.getElementById("q").value);
    if (!p || !q || p === q) {
        alert("Inputlah terlebih dahulu bilangan prima untuk p dan q.");
        return;
    }
    if (!isPrime(p) || !isPrime(q)) {
        alert("p maupun q haruslah bilangan prima.");
        return;
    }

    if (p < 10 || q < 10) {
    alert("Nilai p atau q terlalu kecil. Harus lebih besar dari 10.");
    return;
    }

    const phi = (p - 1) * (q - 1);
    const validE = [];
    for (let e = 2; e < phi; e++) {
        if (gcd(e, phi) === 1) validE.push(e);
    }

    document.getElementById("hint").innerText = validE.join(", ");
    document.getElementById("popup-overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup-overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
}

function encryptMessage() {
    const text = document.getElementById("plain-text").value;
    if (!publicKey) {
        alert("Generate keys terlebih dahulu.");
        return;
    }

    document.getElementById("encrypted-text").innerText = Array.from(text).map(char => {
        const m = char.charCodeAt(0);
        return (BigInt(m) ** BigInt(publicKey.e) % BigInt(publicKey.n)).toString();
    }).join(" ");
}

function decryptMessage() {
    const cipherText = document.getElementById("cipher-text").value;
    if (!privateKey) {
        alert("Generate keys first.");
        return;
    }

    const blocks = cipherText.split(" ");

    const decrypted = blocks.map(block => {
        const c = BigInt(block);
        const m = c ** BigInt(privateKey.d) % BigInt(privateKey.n);
        return String.fromCharCode(Number(m));
    }).join("");

    document.getElementById("decrypted-text").innerText = decrypted;
}
