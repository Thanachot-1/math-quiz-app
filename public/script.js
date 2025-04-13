let questions = [];
let currentIndex = 0;
let userScore = 0;

async function generateFromLLM() {
  const count = parseInt(document.getElementById('question-count').value) || 1;
  questions = [];
  currentIndex = 0;
  userScore = 0;

  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('set-selection').classList.add('hidden');

  for (let i = 0; i < count; i++) {
    const res = await fetch('/api/generate-question');
    const data = await res.json();
    questions.push(data);
  }

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const current = questions[currentIndex];
  document.getElementById('question-text').textContent = `ข้อที่ ${currentIndex + 1}: ${current.question}`;
  document.getElementById('answer-input').value = '';
}

function submitAnswer() {
  const userAnswer = parseInt(document.getElementById('answer-input').value);
  const current = questions[currentIndex];

  if (!isNaN(userAnswer)) {
    if (userAnswer === current.answer) {
      userScore++;
    }
  }

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('score').textContent = `${userScore} / ${questions.length}`;
  }
}

function restart() {
  document.getElementById('result-container').classList.add('hidden');
  document.getElementById('set-selection').classList.remove('hidden');
  document.getElementById('answer-input').value = '';
  questions = [];
  currentIndex = 0;
  userScore = 0;
}
