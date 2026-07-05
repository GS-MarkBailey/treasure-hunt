const STORAGE_KEY = "treasure-hunt-task-complete";

// Set your prize link here (YouTube videos open in the YouTube app on phones)
const TREASURE_LINK = "https://youtu.be/WajLDVMjgok";

// Magic word required before claiming the prize
const MAGIC_WORD = "abracadabra";

const appShellEl = document.getElementById("app-shell");
const questScreenEl = document.getElementById("quest-screen");
const spellScreenEl = document.getElementById("spell-screen");
const completeQuestBtn = document.getElementById("complete-quest-btn");
const openTreasureBtn = document.getElementById("open-treasure-btn");
const prizeRevealEl = document.getElementById("prize-reveal");
const prizeConfettiEl = document.getElementById("prize-confetti");
const resetBtn = document.getElementById("reset-btn");
const magicWordForm = document.getElementById("magic-word-form");
const magicWordInput = document.getElementById("magic-word-input");
const magicWordError = document.getElementById("magic-word-error");
const spellScrollEl = document.getElementById("spell-scroll");

const PRIZE_ANIMATION_MS = 3200;
const CONFETTI_COLORS = ["#f5c518", "#ff6b9d", "#4fc3f7", "#7c4dff", "#ffe082", "#ffffff"];

let prizeOpening = false;

function isTaskComplete() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function showQuestScreen() {
  appShellEl.classList.remove("spell-active");
  questScreenEl.hidden = false;
  questScreenEl.setAttribute("aria-hidden", "false");
  spellScreenEl.hidden = true;
  spellScreenEl.setAttribute("aria-hidden", "true");
}

function showSpellScreen() {
  appShellEl.classList.add("spell-active");
  questScreenEl.hidden = true;
  questScreenEl.setAttribute("aria-hidden", "true");
  spellScreenEl.hidden = false;
  spellScreenEl.setAttribute("aria-hidden", "false");
  window.setTimeout(() => magicWordInput.focus(), 300);
}

function completeQuest() {
  localStorage.setItem(STORAGE_KEY, "true");
  showSpellScreen();
}

function normalizeMagicWord(value) {
  return value.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
}

function isMagicWordCorrect(value) {
  return normalizeMagicWord(value) === normalizeMagicWord(MAGIC_WORD);
}

function clearSpellForm() {
  magicWordInput.value = "";
  magicWordError.hidden = true;
  spellScrollEl.classList.remove("spell-shake", "spell-error");
}

function shakeSpellScroll() {
  spellScrollEl.classList.remove("spell-shake");
  void spellScrollEl.offsetWidth;
  spellScrollEl.classList.add("spell-shake", "spell-error");
}

function resetApp() {
  prizeOpening = false;
  localStorage.removeItem(STORAGE_KEY);
  openTreasureBtn.disabled = false;
  prizeRevealEl.hidden = true;
  prizeRevealEl.setAttribute("aria-hidden", "true");
  prizeRevealEl.classList.remove("active");
  prizeConfettiEl.innerHTML = "";
  clearSpellForm();
  showQuestScreen();
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

completeQuestBtn.addEventListener("click", completeQuest);
magicWordForm.addEventListener("submit", handleClaimPrize);
magicWordInput.addEventListener("input", () => {
  magicWordError.hidden = true;
  spellScrollEl.classList.remove("spell-error");
});
resetBtn.addEventListener("click", resetApp);

if (isTaskComplete()) {
  showSpellScreen();
} else {
  showQuestScreen();
}
