const STORAGE_KEY = "disney-treasure-hunt-progress";

// Customize the final prize URL or message encoded in the QR code
const TREASURE_QR_CONTENT =
  "Congratulations! You completed the treasure hunt! Your prize is waiting in the kitchen cupboard. 🎁"; // Change to a URL or secret message

const TASKS = [
  "Find something shaped like Mickey's ears (two circles!)",
  "Count 7 hidden stars around the house",
  "Do your best royal wave like a princess or prince",
  "Find something red, blue, AND yellow",
  "Whisper the magic words: \"Bibbidi Bobbidi Boo!\"",
  "Hop like Tigger three times in a row",
  "Draw a treasure map on a piece of paper",
  "Find the softest thing you can and give it a hug",
  "Make up a short song about adventure",
  "Find a book and read (or look at) one page together",
];

const taskListEl = document.getElementById("task-list");
const completedCountEl = document.getElementById("completed-count");
const progressFillEl = document.getElementById("progress-fill");
const progressBarEl = document.querySelector(".progress-bar");
const treasureSectionEl = document.getElementById("treasure-section");
const qrCanvasEl = document.getElementById("qr-canvas");
const qrHintEl = document.getElementById("qr-hint");
const scannerDetailsEl = document.querySelector(".scanner-details");
const scannerStatusEl = document.getElementById("scanner-status");

let completed = loadProgress();
let qrGenerated = false;
let html5QrCode = null;

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === TASKS.length) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return TASKS.map(() => false);
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function renderTasks() {
  taskListEl.innerHTML = "";

  TASKS.forEach((text, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (completed[index] ? " done" : "");
    li.dataset.index = index;
    li.innerHTML = `
      <span class="task-number">${index + 1}</span>
      <span class="task-checkbox" aria-hidden="true">${completed[index] ? "✓" : ""}</span>
      <span class="task-text">${text}</span>
    `;
    li.addEventListener("click", () => toggleTask(index));
    taskListEl.appendChild(li);
  });
}

function toggleTask(index) {
  completed[index] = !completed[index];
  saveProgress();
  renderTasks();
  updateProgress();
}

function updateProgress() {
  const count = completed.filter(Boolean).length;
  const total = TASKS.length;
  const pct = (count / total) * 100;

  completedCountEl.textContent = count;
  progressFillEl.style.width = `${pct}%`;
  progressBarEl.setAttribute("aria-valuenow", count);

  if (count === total) {
    unlockTreasure();
  } else {
    lockTreasure();
  }
}

function lockTreasure() {
  treasureSectionEl.classList.remove("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "true");
  stopScanner();
}

function unlockTreasure() {
  treasureSectionEl.classList.add("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "false");

  if (!qrGenerated) {
    generateQRCode();
    qrGenerated = true;
  }

  treasureSectionEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function generateQRCode() {
  QRCode.toCanvas(
    qrCanvasEl,
    TREASURE_QR_CONTENT,
    {
      width: 240,
      margin: 2,
      color: { dark: "#1a237e", light: "#ffffff" },
    },
    (err) => {
      if (err) {
        qrHintEl.textContent = "Could not create QR code. Please refresh the page.";
        return;
      }
      qrHintEl.textContent = `Prize link: ${TREASURE_QR_CONTENT}`;
    }
  );
}

async function startScanner() {
  if (html5QrCode) return;

  scannerStatusEl.textContent = "Starting camera…";

  html5QrCode = new Html5Qrcode("qr-reader");

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      onScanSuccess,
      () => {}
    );
    scannerStatusEl.textContent = "Point the camera at a QR code!";
  } catch (err) {
    scannerStatusEl.textContent =
      "Camera access denied or unavailable. Use the QR code above instead.";
    html5QrCode = null;
  }
}

function stopScanner() {
  if (!html5QrCode) return;

  html5QrCode
    .stop()
    .then(() => {
      html5QrCode.clear();
      html5QrCode = null;
    })
    .catch(() => {
      html5QrCode = null;
    });
}

function onScanSuccess(decodedText) {
  scannerStatusEl.textContent = `Found: ${decodedText}`;
  stopScanner();

  if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
    setTimeout(() => {
      window.open(decodedText, "_blank", "noopener,noreferrer");
    }, 800);
  }
}

scannerDetailsEl.addEventListener("toggle", () => {
  if (scannerDetailsEl.open && treasureSectionEl.classList.contains("unlocked")) {
    startScanner();
  } else {
    stopScanner();
    scannerStatusEl.textContent = "Camera stopped.";
  }
});

renderTasks();
updateProgress();
