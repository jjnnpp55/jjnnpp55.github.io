(function(){
  // TIMER SETUP
  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  if (timerDisplay && startBtn && stopBtn && resetBtn) {
    let timerInterval = null;
    let elapsedSeconds = 0;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }
    function updateTimer() { elapsedSeconds++; timerDisplay.textContent = formatTime(elapsedSeconds); }
    function startTimer() { if (timerInterval) return; timerInterval = setInterval(updateTimer, 1000); }
    function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
    function resetTimer() { stopTimer(); elapsedSeconds = 0; timerDisplay.textContent = '00:00'; }

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
  }

  // VOCABULARY QUIZ SETUP - 200 WORDS TOTAL
  const wordDisplay = document.getElementById("wordDisplay");
  if (wordDisplay) {
    const vocabulary = [
    { word: "Abundant", correct: "Plentiful", wrongDefs: ["Scarce", "Limited", "Sparse"] },
    { word: "Benevolent", correct: "Kindly", wrongDefs: ["Hostile", "Cruel", "Aggressive"] },
    { word: "Candid", correct: "Honest", wrongDefs: ["Secretive", "Guarded", "Deceptive"] },
    { word: "Diligent", correct: "Hardworking", wrongDefs: ["Lazy", "Idle", "Neglectful"] },
    { word: "Eloquent", correct: "Persuasive", wrongDefs: ["Inarticulate", "Mute", "Awkward"] },
    { word: "Frugal", correct: "Thrifty", wrongDefs: ["Wasteful", "Extravagant", "Lavish"] },
    { word: "Gregarious", correct: "Sociable", wrongDefs: ["Shy", "Introverted", "Reserved"] },
    { word: "Honest", correct: "Truthful", wrongDefs: ["Deceptive", "Dishonest", "False"] },
    { word: "Impartial", correct: "Fair", wrongDefs: ["Biased", "Prejudiced", "Partial"] },
    { word: "Judicious", correct: "Wise", wrongDefs: ["Reckless", "Careless", "Foolish"] },
    { word: "Keen", correct: "Perceptive", wrongDefs: ["Dull", "Indifferent", "Unaware"] },
    { word: "Luminous", correct: "Bright", wrongDefs: ["Dark", "Dim", "Shadowy"] },
    { word: "Meticulous", correct: "Precise", wrongDefs: ["Careless", "Hasty", "Sloppy"] },
    { word: "Nurture", correct: "Cultivate", wrongDefs: ["Neglect", "Ignore", "Harm"] },
    { word: "Obsolete", correct: "Outdated", wrongDefs: ["Modern", "Current", "Fresh"] },
    { word: "Prudent", correct: "Careful", wrongDefs: ["Reckless", "Impulsive", "Careless"] },
    { word: "Quaint", correct: "Old-fashioned", wrongDefs: ["Modern", "Common", "Ordinary"] },
    { word: "Resilient", correct: "Tough", wrongDefs: ["Weak", "Fragile", "Brittle"] },
    { word: "Skeptical", correct: "Doubting", wrongDefs: ["Trusting", "Gullible", "Certain"] },
    { word: "Tangible", correct: "Physical", wrongDefs: ["Imaginary", "Abstract", "Unreal"] },
    { word: "Ubiquitous", correct: "Everywhere", wrongDefs: ["Rare", "Uncommon", "Limited"] },
    { word: "Vigilant", correct: "Watchful", wrongDefs: ["Distracted", "Careless", "Sleepy"] },
    { word: "Wary", correct: "Cautious", wrongDefs: ["Trusting", "Bold", "Reckless"] },
    { word: "Zealous", correct: "Passionate", wrongDefs: ["Indifferent", "Lazy", "Apathetic"] },
    { word: "Audacious", correct: "Bold", wrongDefs: ["Timid", "Shy", "Cautious"] },
    { word: "Brusque", correct: "Abrupt", wrongDefs: ["Polite", "Friendly", "Gentle"] },
    { word: "Cacophony", correct: "Discord", wrongDefs: ["Harmony", "Melody", "Silence"] },
    { word: "Debilitate", correct: "Weaken", wrongDefs: ["Strengthen", "Support", "Aid"] },
    { word: "Euphemism", correct: "Substitute", wrongDefs: ["Insult", "Slur", "Offense"] },
    { word: "Fallacy", correct: "Misbelief", wrongDefs: ["Truth", "Fact", "Reality"] },
    { word: "Garrulous", correct: "Talkative", wrongDefs: ["Silent", "Quiet", "Reserved"] },
    { word: "Hapless", correct: "Unlucky", wrongDefs: ["Lucky", "Fortunate", "Favored"] },
    { word: "Iconoclast", correct: "Rebel", wrongDefs: ["Follower", "Believer", "Supporter"] },
    { word: "Juxtapose", correct: "Compare", wrongDefs: ["Separate", "Divide", "Isolate"] },
    { word: "Kinetic", correct: "Moving", wrongDefs: ["Still", "Static", "Idle"] },
    { word: "Lethargic", correct: "Sluggish", wrongDefs: ["Energetic", "Alert", "Active"] },
    { word: "Myriad", correct: "Countless", wrongDefs: ["Few", "Limited", "Small"] },
    { word: "Nefarious", correct: "Evil", wrongDefs: ["Good", "Kind", "Virtuous"] },
    { word: "Obfuscate", correct: "Confuse", wrongDefs: ["Clarify", "Explain", "Elucidate"] },
    { word: "Paragon", correct: "Model", wrongDefs: ["Flaw", "Defect", "Failure"] },
    { word: "Quell", correct: "Suppress", wrongDefs: ["Encourage", "Instigate", "Promote"] },
    { word: "Recalcitrant", correct: "Defiant", wrongDefs: ["Obedient", "Compliant", "Agreeable"] },
    { word: "Sagacious", correct: "Insightful", wrongDefs: ["Foolish", "Ignorant", "Naive"] },
    { word: "Trepidation", correct: "Fear", wrongDefs: ["Calm", "Confidence", "Bravery"] },
    { word: "Unilateral", correct: "One-sided", wrongDefs: ["Mutual", "Balanced", "Shared"] },
    { word: "Vociferous", correct: "Loud", wrongDefs: ["Quiet", "Soft", "Muted"] },
    { word: "Wanton", correct: "Reckless", wrongDefs: ["Justified", "Cautious", "Controlled"] },
    { word: "Abhor", correct: "Hate deeply", wrongDefs: ["Love deeply", "Ignore quietly", "Enjoy mildly"] },
    { word: "Abridge", correct: "Shorten text", wrongDefs: ["Lengthen text", "Hide meaning", "Change topic"] },
    { word: "Adept", correct: "Highly skilled", wrongDefs: ["Barely skilled", "Completely clueless", "Moderately clumsy"] },
    { word: "Admonish", correct: "Warn gently", wrongDefs: ["Praise loudly", "Ignore completely", "Reward generously"] },
    { word: "Affable", correct: "Friendly pleasant", wrongDefs: ["Rude hostile", "Cold distant", "Aloof unfriendly"] },
    { word: "Alleviate", correct: "Ease pain", wrongDefs: ["Increase pain", "Hide pain", "Ignore pain"] },
    { word: "Ambiguous", correct: "Unclear meaning", wrongDefs: ["Perfectly clear", "Strongly honest", "Openly direct"] },
    { word: "Amiable", correct: "Good natured", wrongDefs: ["Bad tempered", "Highly arrogant", "Extremely cruel"] },
    { word: "Anomaly", correct: "Irregular event", wrongDefs: ["Normal rule", "Shared habit", "Fixed custom"] },
    { word: "Antagonize", correct: "Make hostile", wrongDefs: ["Make friendly", "Calm gently", "Reassure kindly"] },
    { word: "Apathy", correct: "Lack interest", wrongDefs: ["Strong passion", "Deep sympathy", "Sharp focus"] },
    { word: "Arduous", correct: "Very difficult", wrongDefs: ["Quite simple", "Completely effortless", "Fairly pleasant"] },
    { word: "Articulate", correct: "Speak clearly", wrongDefs: ["Speak vaguely", "Mumble softly", "Whisper incoherently"] },
    { word: "Ascend", correct: "Move upward", wrongDefs: ["Move downward", "Stay still", "Move backward"] },
    { word: "Aspire", correct: "Aim high", wrongDefs: ["Care less", "Refuse goals", "Avoid success"] },
    { word: "Astute", correct: "Mentally sharp", wrongDefs: ["Very foolish", "Easily confused", "Hopelessly naive"] },
    { word: "Audible", correct: "Able heard", wrongDefs: ["Completely silent", "Barely visible", "Easily forgotten"] },
    { word: "Authentic", correct: "Genuinely real", wrongDefs: ["Clearly fake", "Mostly imagined", "Partly copied"] },
    { word: "Avert", correct: "Prevent happening", wrongDefs: ["Cause happening", "Ignore danger", "Invite trouble"] },
    { word: "Banal", correct: "Dull common", wrongDefs: ["Highly original", "Deeply moving", "Extremely rare"] },
    { word: "Belittle", correct: "Make seemless", wrongDefs: ["Build praise", "Treat equally", "Reward generously"] },
    { word: "Benign", correct: "Harmless gentle", wrongDefs: ["Highly toxic", "Openly cruel", "Very dangerous"] },
    { word: "Bolster", correct: "Support strengthen", wrongDefs: ["Weaken slowly", "Block progress", "Dismiss entirely"] },
    { word: "Boisterous", correct: "Noisily rowdy", wrongDefs: ["Completely silent", "Calm orderly", "Deeply serious"] },
    { word: "Brazen", correct: "Shameless bold", wrongDefs: ["Deeply shy", "Easily scared", "Politely modest"] },
    ]

  const wordDisplay = document.getElementById("wordDisplay");
  const quizForm = document.getElementById("quizForm");
  const optionsContainer = document.getElementById("optionsContainer");
  const resultDiv = document.getElementById("result");
  const submitBtn = quizForm.querySelector('button[type="submit"]');
  const nextBtn = document.getElementById("nextBtn");
  const scoreDisplay = document.getElementById('scoreDisplay');
  const resetScoreBtn = document.getElementById('resetScoreBtn');

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create a random non‑repeating order of vocabulary indices
  let wordQueue = [];
  function resetWordQueue() {
    wordQueue = shuffle(vocabulary.map((_, idx) => idx));
  }
  function getNextWordIndex() {
    if (wordQueue.length === 0) {
      return null; // no more words this run
    }
    return wordQueue.shift();
  }

  let currentWordIndex = null;
  let currentWordData = null;

  // Track correct and attempted questions
  let score = 0;
  let attempted = 0;
  let questionNumber = 0; // purely for display: Word 1, Word 2, ...

  function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score} of ${attempted} correct`;
  }

  resetScoreBtn.addEventListener('click', () => {
    score = 0;
    attempted = 0;
    updateScoreDisplay();
  });

  function createOptions(options) {
    optionsContainer.innerHTML = '';
    options.forEach((def, i) => {
      const optionId = `option${i}`;
      const optionDiv = document.createElement('div');
      optionDiv.style.marginBottom = '6px';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.id = optionId;
      radio.name = 'definition';
      radio.value = def;
      radio.style.marginRight = '5px';
      radio.style.width = '14px';
      radio.style.height = '14px';
      radio.onchange = () => {
        submitBtn.disabled = false;
        resultDiv.textContent = '';
      };

      const label = document.createElement('label');
      label.htmlFor = optionId;
      label.textContent = def;
      label.style.cursor = 'pointer';
      label.style.fontSize = '0.85rem';

      optionDiv.appendChild(radio);
      optionDiv.appendChild(label);
      optionsContainer.appendChild(optionDiv);
    });
    submitBtn.disabled = true;
  }

  function loadNewWord() {
    const nextIndex = getNextWordIndex();
    if (nextIndex === null) {
      // No more words – end of quiz
      wordDisplay.textContent = "All words completed!";
      optionsContainer.innerHTML = '';
      resultDiv.textContent = '';
      submitBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }

    currentWordIndex = nextIndex;
    currentWordData = vocabulary[currentWordIndex];

    // Increment display counter so the user sees Word 1, Word 2, ...
    questionNumber++;
    wordDisplay.textContent = `${currentWordData.word} (${questionNumber})`;

    const options = shuffle([currentWordData.correct, ...currentWordData.wrongDefs]);
    createOptions(options);
    resultDiv.textContent = '';
    submitBtn.disabled = true;
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    quizForm.reset();
  }

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(quizForm);
    const selected = formData.get("definition");
    if (!selected) return;

    attempted++;
    if (selected === currentWordData.correct) {
      resultDiv.style.color = "green";
      resultDiv.textContent = "Correct! 🎉";
      score++;
    } else {
      resultDiv.style.color = "red";
      resultDiv.textContent = `Oops! Correct answer: "${currentWordData.correct}"`;
    }
    updateScoreDisplay();

    submitBtn.disabled = true;
    Array.from(optionsContainer.querySelectorAll("input[type=radio]")).forEach(input => {
      input.disabled = true;
    });

    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  });

  nextBtn.addEventListener("click", () => {
    loadNewWord();
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  });

  // Initialize vocab quiz
  resetWordQueue();
  updateScoreDisplay();
  questionNumber = 0;
  loadNewWord();
  }

  // SPIN THE WHEEL GAME
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spinBtn');
  
  if (wheel && spinBtn) {
    let deg = 0;
    let spinning = false;

    spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    const extraDeg = Math.floor(Math.random() * 360);
    const rotations = Math.floor(Math.random() * 3) + 3;
    deg += rotations * 360 + extraDeg;
    wheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    wheel.style.transform = `rotate(${deg}deg)`;
    wheel.addEventListener('transitionend', () => {
      spinning = false;
      spinBtn.disabled = false;
    }, { once: true });
  });
  }

})();

window.onload = function () {
  const qForm = document.getElementById('quiz-form');
  if (qForm) qForm.reset();
  shuffleOptions();
};

// Shuffle radio option labels inside .options div for each question
function shuffleOptions() {
  document.querySelectorAll('.question').forEach(function (qDiv) {
    const optionsDiv = qDiv.querySelector('.options');
    if (!optionsDiv) return;
    let optionsArr = Array.from(optionsDiv.children);

    for (let i = optionsArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsArr[i], optionsArr[j]] = [optionsArr[j], optionsArr[i]];
    }

    optionsArr.forEach(opt => optionsDiv.appendChild(opt));
  });
}

function checkQuiz() {
  const questionDivs = document.querySelectorAll('.question');
  let correct = 0;

  questionDivs.forEach(qDiv => {
    const correctAns = qDiv.getAttribute('data-answer');
    const picked = qDiv.querySelector('input[type="radio"]:checked');
    const feedback = qDiv.querySelector('.feedback');

    if (picked && picked.value === correctAns) {
      correct++;
      feedback.textContent = "✓ Correct!";
      feedback.style.color = "green";
    } else if (picked) {
      feedback.textContent = "✗ Incorrect";
      feedback.style.color = "red";
    } else {
      feedback.textContent = "";
    }
  });

  document.getElementById("quiz-summary").textContent =
   `You got ${correct} out of ${questionDivs.length} correct.`;
}

function resetQuiz() {
  const form = document.getElementById("quiz-form");
  form.reset();

  document.querySelectorAll('.feedback').forEach(div => {
    div.textContent = "";
  });

  document.getElementById("quiz-summary").textContent = "";

  shuffleOptions();
}

// Run option shuffle on page load
shuffleOptions();

/* Pattern Tapper  */

const maxLevel = 10;
let level = 1;
let pattern = [];
let userPattern = [];
let hiddenIndices = [];
const grid = document.getElementById("grid");
const showBtn = document.getElementById("showBtn");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const feedback = document.getElementById("feedback");
const levelInfo = document.getElementById("levelInfo");
const levelSelect = document.getElementById("levelSelect");
const cellEls = [];

if (grid && levelSelect && showBtn) {
// Populate level select dropdown
for (let i = 1; i <= maxLevel; i++) {
  const opt = document.createElement("option");
  opt.value = i;
  opt.text = `Level ${i}`;
  levelSelect.appendChild(opt);
}

function updateLevelInfo() {
  levelInfo.textContent = `Level ${level} / ${maxLevel}`;
  levelSelect.value = level;
}

function getHiddenIndices(level) {
  if (level < 6) return [];
  const hideCount = Math.min(level - 5, 9);
  let allIndices = Array.from({ length: 9 }, (_, i) => i);
  let selected = [];
  while (selected.length < hideCount && allIndices.length > 0) {
    let rnd = Math.floor(Math.random() * allIndices.length);
    selected.push(allIndices[rnd]);
    allIndices.splice(rnd, 1);
  }
  return selected;
}

function renderGrid() {
  for (let i = 0; i < 9; i++) {
    cellEls[i].innerText = hiddenIndices.includes(i) ? "" : (i + 1);
  }
}

// Create grid cells once
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.idx = i;
  cell.innerText = i + 1;
  cell.addEventListener("click", () => {
    if (checkBtn.disabled) return;
    if (userPattern.length < pattern.length) {
      cell.classList.add("active");
      userPattern.push(i);
      setTimeout(() => cell.classList.remove("active"), 300);
    }
  });
  cellEls.push(cell);
  grid.appendChild(cell);
}

function flashPattern() {
  let i = 0;
  checkBtn.disabled = true;
  showBtn.disabled = true;
  nextBtn.style.display = "none";
  feedback.textContent = "";
  userPattern = [];
  function highlight() {
    if (i > 0) cellEls[pattern[i - 1]].classList.remove("active");
    if (i < pattern.length) {
      cellEls[pattern[i]].classList.add("active");
      i++;
      setTimeout(highlight, 600);
    } else {
      setTimeout(() => {
        cellEls[pattern[pattern.length - 1]].classList.remove("active");
        checkBtn.disabled = false;
        showBtn.disabled = true;
      }, 300);
    }
  }
  highlight();
}

function generatePattern(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 9));
  }
  return arr;
}

showBtn.addEventListener("click", () => {
  pattern = generatePattern(level + 2);  // pattern length grows with level
  flashPattern();
});

checkBtn.addEventListener("click", () => {
  if (JSON.stringify(pattern) === JSON.stringify(userPattern)) {
    feedback.style.color = "#4caf50";
    feedback.textContent = "✅ Correct! Click Next Level when ready.";
    nextBtn.style.display = (level < maxLevel) ? "block" : "none";
    checkBtn.disabled = true;
    showBtn.disabled = true;
  } else {
    feedback.style.color = "#d32f2f";
    feedback.textContent = `❌ Wrong! Pattern was: ${pattern.map(i => (i + 1)).join(", ")}`;
    checkBtn.disabled = true;
    showBtn.disabled = false;
    nextBtn.style.display = "none";
  }
  userPattern = [];
});

nextBtn.addEventListener("click", () => {
  if (level < maxLevel) {
    level++;
    updateLevelInfo();
    hiddenIndices = getHiddenIndices(level);
    renderGrid();
    showBtn.disabled = false;
    checkBtn.disabled = true;
    nextBtn.style.display = "none";
    feedback.textContent = "";
    userPattern = [];
    pattern = [];
  }
});

resetBtn.addEventListener("click", () => {
  userPattern = [];
  pattern = [];
  feedback.textContent = "";
  showBtn.disabled = false;
  checkBtn.disabled = true;
  nextBtn.style.display = "none";
  hiddenIndices = getHiddenIndices(level);
  renderGrid();
});

levelSelect.addEventListener("change", () => {
  level = parseInt(levelSelect.value, 10);
  updateLevelInfo();
  userPattern = [];
  pattern = [];
  feedback.textContent = "";
  showBtn.disabled = false;
  checkBtn.disabled = true;
  nextBtn.style.display = "none";
  hiddenIndices = getHiddenIndices(level);
  renderGrid();
});

// Keyboard input: 1-9 for grid cells
document.addEventListener("keydown", (e) => {
  if (e.key >= '1' && e.key <= '9') {
    if (!checkBtn.disabled && userPattern.length < pattern.length) {
      let num = parseInt(e.key, 10) - 1;
      userPattern.push(num);
      cellEls[num].classList.add("active");
      setTimeout(() => cellEls[num].classList.remove("active"), 300);
    }
  } else if (e.key === "Enter" && !checkBtn.disabled) {
    checkBtn.click();
    e.preventDefault();
  }
});

// Initialize pattern tapper
hiddenIndices = getHiddenIndices(level);
renderGrid();
updateLevelInfo();
}

// Tic Tac Toe

const tttCells = document.querySelectorAll('.ttt-cell');
const tttStatus = document.getElementById('ttt-status');
const tttReset = document.getElementById('ttt-reset');

if (tttStatus && tttReset && tttCells.length > 0) {
let board = Array(9).fill('');
let player = 'X';
let computer = 'O';
let gameActive = true;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],    // rows
  [0,3,6],[1,4,7],[2,5,8],    // cols
  [0,4,8],[2,4,6]             // diagonals
];

function updateStatus(msg = '') {
  if (!msg) {
    tttStatus.textContent = `Your turn (${player})`;
  } else {
    tttStatus.textContent = msg;
  }
}

function checkWinner(brd, symbol) {
  for (const combo of winCombos) {
    if (combo.every(i => brd[i] === symbol)) {
      return true;
    }
  }
  return false;
}

function checkDraw(brd) {
  return brd.every(cell => cell !== '');
}

function computerMove() {
  if (!gameActive) return;
  let emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
  if (emptyIndices.length === 0) return;

  let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[choice] = computer;
  const cell = tttCells[choice];
  cell.textContent = computer;
  cell.classList.add('o');

  if (checkWinner(board, computer)) {
    gameActive = false;
    updateStatus("Computer wins! 😞");
    disableBoard();
  } else if (checkDraw(board)) {
    gameActive = false;
    updateStatus("It's a draw!");
  } else {
      updateStatus();
    }
}

function disableBoard() {
  tttCells.forEach(cell => cell.style.pointerEvents = "none");
}

function enableBoard() {
  tttCells.forEach(cell => cell.style.pointerEvents = "auto");
}

function playerMove(e) {
  const idx = parseInt(e.target.dataset.index);
  if (!gameActive || board[idx] !== '') return;

  board[idx] = player;
  e.target.textContent = player;
  e.target.classList.add('x');

  if (checkWinner(board, player)) {
    gameActive = false;
    updateStatus("You win! 🎉");
    disableBoard();
  } else if (checkDraw(board)) {
    gameActive = false;
    updateStatus("It's a draw!");
  } else {
    updateStatus("Computer's turn...");
    disableBoard();
    setTimeout(() => {
      computerMove();
      if (gameActive) enableBoard();
    }, 600);
  }
}

function resetGame() {
  board.fill('');
  gameActive = true;
  tttCells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
    cell.style.pointerEvents = "auto";
  });
  updateStatus();
}

tttCells.forEach(cell => cell.addEventListener('click', playerMove));
tttReset.addEventListener('click', resetGame);

updateStatus();
}
