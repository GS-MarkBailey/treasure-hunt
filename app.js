const STORAGE_KEY = "disney-treasure-hunt-progress";

// Set your prize link here (YouTube videos open in the YouTube app on phones)
const TREASURE_LINK = "https://youtu.be/WajLDVMjgok";

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
const treasureStatusEl = document.getElementById("treasure-status");
const openTreasureBtn = document.getElementById("open-treasure-btn");
const prizeRevealEl = document.getElementById("prize-reveal");
const prizeConfettiEl = document.getElementById("prize-confetti");

const PRIZE_ANIMATION_MS = 3200;
const CONFETTI_COLORS = ["#f5c518", "#ff6b9d", "#4fc3f7", "#7c4dff", "#ffe082", "#ffffff"];

let completed = loadProgress();
let prizeOpening = false;

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
  const wasComplete = completed.every(Boolean);
  completed[index] = !completed[index];
  saveProgress();
  renderTasks();

  const nowComplete = completed.every(Boolean);
  updateProgress(!wasComplete && nowComplete);
}

function updateProgress(openLink = false) {
  const count = completed.filter(Boolean).length;
  const total = TASKS.length;
  const pct = (count / total) * 100;

  completedCountEl.textContent = count;
  progressFillEl.style.width = `${pct}%`;
  progressBarEl.setAttribute("aria-valuenow", count);

  if (count === total) {
    unlockTreasure(openLink);
  } else {
    lockTreasure();
  }
}

function lockTreasure() {
  treasureSectionEl.classList.remove("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "true");
}

function unlockTreasure(openLink = false) {
  treasureSectionEl.classList.add("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "false");
  treasureSectionEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (openLink) {
    openTreasureLink();
  }
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function openTreasureFromGesture() {
  const link = document.createElement("a");
  link.href = TREASURE_LINK;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function navigateToTreasure() {
  window.location.assign(TREASURE_LINK);
}

function spawnConfetti() {
  prizeConfettiEl.innerHTML = "";

  for (let i = 0; i < 50; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDelay = `${0.5 + Math.random() * 0.6}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
    prizeConfettiEl.appendChild(piece);
  }
}

function playPrizeAnimation() {
  prizeOpening = true;
  openTreasureBtn.disabled = true;

  spawnConfetti();
  prizeRevealEl.hidden = false;
  prizeRevealEl.setAttribute("aria-hidden", "false");
  prizeRevealEl.classList.add("active");
}

function openTreasureLink() {
  if (prizeOpening) return;

  playPrizeAnimation();

  if (isMobileDevice()) {
    // Open during the tap so phones jump straight into YouTube (no "Open in app?" prompt)
    openTreasureFromGesture();
    return;
  }

  window.setTimeout(navigateToTreasure, PRIZE_ANIMATION_MS);
}

openTreasureBtn.addEventListener("click", openTreasureLink);

renderTasks();
updateProgress();
