document.addEventListener('DOMContentLoaded', () => {
  const basicDetailsForm = document.getElementById('details-form');
  const topicSelectionDiv = document.getElementById('topic-selection');
  const difficultySelectionDiv = document.getElementById('difficulty-selection');
  const questionDisplayDiv = document.getElementById('question-display');
  const topicsDiv = document.getElementById('topics');
  const userInfoSpan = document.getElementById('user-info');
  const questionCountSpan = document.getElementById('question-count');
  const timerDiv = document.getElementById('timer');
  const questionDiv = document.getElementById('question');
  const optionsDiv = document.getElementById('options');
  const nextButton = document.getElementById('next');
  const prevButton = document.getElementById('prev');
  const logoutButton = document.getElementById('logout');
  const searchInput = document.getElementById('search');
  const sortButton = document.getElementById('sort');

  let userDetails = {};
  let topics = [];
  let filteredTopics = [];
  let selectedTopic = '';
  let selectedDifficulty = '';
  let questions = [];
  let currentQuestionIndex = 0;
  let timer;

  // Handle form submission
  basicDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userDetails = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      gender: document.getElementById('gender').value,
    };
    document.getElementById('basic-details').style.display = 'none';
    topicSelectionDiv.style.display = 'block';
    fetchTopics();
  });

  // Fetch topics from a JSON file (or an API)
  const fetchTopics = async () => {
    try {
      const response = await fetch('data/questions.json');
      const data = await response.json();
      topics = data.topics;
      filteredTopics = [...topics];
      displayTopics();
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  // Display topics
  const displayTopics = () => {
    topicsDiv.innerHTML = '';
    filteredTopics.forEach(topic => {
      const topicDiv = document.createElement('div');
      topicDiv.textContent = topic.name;
      topicDiv.className = 'topic';
      topicDiv.addEventListener('click', () => {
        selectedTopic = topic.name;
        topicSelectionDiv.style.display = 'none';
        difficultySelectionDiv.style.display = 'block';
      });
      topicsDiv.appendChild(topicDiv);
    });
  };

  // Handle search input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredTopics = topics.filter(topic => topic.name.toLowerCase().includes(query));
    displayTopics();
  });

  // Handle sorting
  sortButton.addEventListener('click', () => {
    filteredTopics.sort((a, b) => a.name.localeCompare(b.name));
    displayTopics();
  });

  // Handle difficulty selection
  document.querySelectorAll('.difficulty').forEach(button => {
    button.addEventListener('click', (e) => {
      selectedDifficulty = e.target.dataset.level;
      difficultySelectionDiv.style.display = 'none';
      questionDisplayDiv.style.display = 'block';
      userInfoSpan.textContent = `${userDetails.name} (${userDetails.email})`;
      fetchQuestions();
    });
  });

  // Fetch questions based on selected topic and difficulty
  const fetchQuestions = async () => {
    try {
      const response = await fetch('data/questions.json');
      const data = await response.json();
      questions = data.questions.filter(q => q.topic === selectedTopic && q.difficulty === selectedDifficulty);
      questionCountSpan.textContent = `Questions: ${questions.length}`;
      displayQuestion();
      startTimer(600); // 10 minutes
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Display a question
  const displayQuestion = () => {
    const question = questions[currentQuestionIndex];
    questionDiv.textContent = question.question;
    optionsDiv.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.textContent = option;
      optionDiv.className = 'option';
      optionDiv.addEventListener('click', () => {
        question.userAnswer = index;
      });
      optionsDiv.appendChild(optionDiv);
    });
  };

  // Handle next question
  nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    }
  });

  // Handle previous question
  prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  });

  // Handle logout
  logoutButton.addEventListener('click', () => {
    location.reload();
  });

  // Start the timer
  const startTimer = (duration) => {
    let time = duration;
    timer = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerDiv.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      if (time <= 0) {
        clearInterval(timer);
        alert('Time is up!');
      }
      time--;
    }, 1000);
  };
});
