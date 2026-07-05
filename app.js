const STORAGE_KEY = "treasure-hunt-progress";

// Set your prize link here (YouTube videos open in the YouTube app on phones)
const TREASURE_LINK = "https://youtu.be/WajLDVMjgok";

// Magic word required before claiming the prize
const MAGIC_WORD = "abracadabra";

const TASKS = [
  "Find something made of two circles stacked on top of each other!",
  "Count 7 hidden stars around the house",
  "Do your best royal explorer wave",
  "Find something red, blue, AND yellow",
  "Whisper the magic word: \"abracadabra!\"",
  "Hop on one foot three times in a row",
  "Draw a treasure map on a piece of paper",
  "Find the softest thing you can and give it a hug",
  "Make up a short song about adventure",
  "Find a book and read (or look at) one page together",
];

const completedCountEl = document.getElementById("completed-count");
const progressFillEl = document.getElementById("progress-fill");
const progressBarEl = document.querySelector(".progress-bar");
const treasureSectionEl = document.getElementById("treasure-section");
const appShellEl = document.getElementById("app-shell");
const openTreasureBtn = document.getElementById("open-treasure-btn");
const prizeRevealEl = document.getElementById("prize-reveal");
const prizeConfettiEl = document.getElementById("prize-confetti");
const tasksCardEl = document.getElementById("tasks-card");
const stepLabelEl = document.getElementById("step-label");
const stepDotsEl = document.getElementById("step-dots");
const currentTaskEl = document.getElementById("current-task");
const currentTaskNumberEl = document.getElementById("current-task-number");
const currentTaskTextEl = document.getElementById("current-task-text");
const completeStepBtn = document.getElementById("complete-step-btn");
const allDoneMessageEl = document.getElementById("all-done-message");
const resetBtn = document.getElementById("reset-btn");
const hudResetBtn = document.getElementById("hud-reset-btn");
const treasureResetBtn = document.getElementById("treasure-reset-btn");
const magicWordForm = document.getElementById("magic-word-form");
const magicWordInput = document.getElementById("magic-word-input");
const magicWordError = document.getElementById("magic-word-error");
const spellScrollEl = document.getElementById("spell-scroll");

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

function getCurrentStepIndex() {
  const index = completed.findIndex((done) => !done);
  return index === -1 ? TASKS.length : index;
}

function renderStepDots(activeIndex) {
  stepDotsEl.innerHTML = "";

  TASKS.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "step-dot";
    if (completed[index]) {
      dot.classList.add("done");
    }
    if (index === activeIndex) {
      dot.classList.add("active");
    }
    stepDotsEl.appendChild(dot);
  });
}

function renderCurrentStep() {
  const stepIndex = getCurrentStepIndex();
  const allDone = stepIndex >= TASKS.length;

  if (allDone) {
    tasksCardEl.classList.add("all-complete");
    currentTaskEl.hidden = true;
    allDoneMessageEl.hidden = false;
    renderStepDots(TASKS.length);
    return;
  }

  tasksCardEl.classList.remove("all-complete");
  currentTaskEl.hidden = false;
  allDoneMessageEl.hidden = true;

  stepLabelEl.textContent = `Quest ${stepIndex + 1}`;
  currentTaskNumberEl.textContent = stepIndex + 1;
  currentTaskTextEl.textContent = TASKS[stepIndex];
  renderStepDots(stepIndex);

  currentTaskEl.classList.remove("step-enter");
  void currentTaskEl.offsetWidth;
  currentTaskEl.classList.add("step-enter");
}

function completeCurrentStep() {
  const stepIndex = getCurrentStepIndex();
  if (stepIndex >= TASKS.length) return;

  completed[stepIndex] = true;
  saveProgress();

  renderCurrentStep();
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

function normalizeMagicWord(value) {
  return value.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
}

function isMagicWordCorrect(value) {
  return normalizeMagicWord(value) === normalizeMagicWord(MAGIC_WORD);
}

function clearMagicWordForm() {
  magicWordInput.value = "";
  magicWordError.hidden = true;
  spellScrollEl.classList.remove("spell-shake", "spell-error");
}

function shakeSpellScroll() {
  spellScrollEl.classList.remove("spell-shake");
  void spellScrollEl.offsetWidth;
  spellScrollEl.classList.add("spell-shake", "spell-error");
}

function resetProgress() {
  completed = TASKS.map(() => false);
  prizeOpening = false;
  localStorage.removeItem(STORAGE_KEY);

  openTreasureBtn.disabled = false;
  prizeRevealEl.hidden = true;
  prizeRevealEl.setAttribute("aria-hidden", "true");
  prizeRevealEl.classList.remove("active");
  prizeConfettiEl.innerHTML = "";
  clearMagicWordForm();
  appShellEl.classList.remove("treasure-mode");

  renderCurrentStep();
  updateProgress();
}

function handleReset() {
  const confirmed = window.confirm(
    "Start a brand-new treasure hunt? This clears all progress and begins at Quest 1."
  );
  if (confirmed) {
    resetProgress();
  }
}

function lockTreasure() {
  appShellEl.classList.remove("treasure-mode");
  treasureSectionEl.classList.remove("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "true");
}

function unlockTreasure() {
  appShellEl.classList.add("treasure-mode");
  treasureSectionEl.classList.add("unlocked");
  treasureSectionEl.setAttribute("aria-hidden", "false");
  window.setTimeout(() => magicWordInput.focus(), 400);
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

function handleClaimPrize(event) {
  event.preventDefault();
  if (prizeOpening) return;

  if (!isMagicWordCorrect(magicWordInput.value)) {
    magicWordError.hidden = false;
    shakeSpellScroll();
    magicWordInput.focus();
    return;
  }

  magicWordError.hidden = true;
  spellScrollEl.classList.remove("spell-shake", "spell-error");
  openTreasureLink();
}

function openTreasureLink() {
  playPrizeAnimation();

  if (isMobileDevice()) {
    openTreasureFromGesture();
    return;
  }

  window.setTimeout(navigateToTreasure, PRIZE_ANIMATION_MS);
}

completeStepBtn.addEventListener("click", completeCurrentStep);
magicWordForm.addEventListener("submit", handleClaimPrize);
magicWordInput.addEventListener("input", () => {
  magicWordError.hidden = true;
  spellScrollEl.classList.remove("spell-error");
});
resetBtn.addEventListener("click", handleReset);
hudResetBtn.addEventListener("click", handleReset);
treasureResetBtn.addEventListener("click", handleReset);

renderCurrentStep();
updateProgress();
