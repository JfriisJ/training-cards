const topicButtonsContainer = document.getElementById("topic-buttons");
const tagButtonsContainer = document.getElementById("tag-buttons");
const tagsContainer = document.getElementById("tags-container");
const cardGrid = document.getElementById("card-grid");
let selectedTopic = null;
let questionsData = [];

// Generate topic buttons dynamically
function generateTopicButtons(data) {
    topicButtonsContainer.innerHTML = ""; // Clear existing buttons
    data.forEach(({ topic }) => {
        const button = document.createElement("button");
        button.classList.add("topic-button");
        button.textContent = topic;

        button.addEventListener("click", () => {
            selectedTopic = topic; // Update selectedTopic
            const selectedData = data.find((item) => item.topic === topic);
            if (selectedData) {
                displayTagsAndQuestions(selectedData.questions);
                addRandomCardButton(selectedData.questions); // Add random card functionality
            }
        });

        topicButtonsContainer.appendChild(button);
    });
}

// Display tags and questions for the selected topic
function displayTagsAndQuestions(questionsData) {
    tagsContainer.style.display = "block"; // Show the tags section
    const uniqueTags = [...new Set(questionsData.flatMap((q) => q.tags))];
    generateTagButtons(uniqueTags);
    renderCards(questionsData);
}

// Generate tag buttons dynamically
function generateTagButtons(tags) {
    tagButtonsContainer.innerHTML = ""; // Clear existing buttons

    tags.forEach((tag) => {
        const button = document.createElement("button");
        button.classList.add("tag-button");
        button.textContent = tag;

        button.addEventListener("click", () => filterByTag(tag));
        tagButtonsContainer.appendChild(button);
    });
}

// Add a random card button
function addRandomCardButton(topicQuestions) {
    let randomButton = document.querySelector(".random-button");
    if (!randomButton) {
        randomButton = document.createElement("button");
        randomButton.classList.add("random-button");
        randomButton.textContent = "RANDOM CARD";

        // Ensure it only picks from the selected topic's questions
        randomButton.addEventListener("click", showRandomCard);
        tagsContainer.appendChild(randomButton);
    }
}


// Show a random card
// Show a random card from the selected topic
function showRandomCard() {
    if (!selectedTopic) {
        alert("Please select a topic first.");
        return;
    }

    // Find the questions for the selected topic
    const topicData = questionsData.find((item) => item.topic === selectedTopic);
    if (!topicData || topicData.questions.length === 0) {
        alert("No questions available for the selected topic.");
        return;
    }

    // Pick a random question from the selected topic's questions
    const randomIndex = Math.floor(Math.random() * topicData.questions.length);
    const randomQuestion = topicData.questions[randomIndex];
    renderCards([randomQuestion]); // Render only the random question
}


// Render cards dynamically
function renderCards(data) {
    cardGrid.innerHTML = ""; // Clear existing cards

    data.forEach(({ question, answer, tags }) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-tags", tags.join(",").toLowerCase());

        card.innerHTML = `
      <div class="card-inner flip-inverted-diagonal">
        <div class="card-front">
          <h2 class="question">${question}</h2>
        </div>
        <div class="card-back back-flip-inverted-diagonal">
          <p class="answer">${answer}</p>
          <div class="tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
      </div>
    `;

        cardGrid.appendChild(card);
    });
}

// Filter cards by tags
function filterByTag(tag) {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        const tags = card.getAttribute("data-tags").split(",");
        card.style.display = tags.includes(tag.toLowerCase()) ? "block" : "none";
    });
}


// Reset all cards to show all questions for the selected topic
function resetCards() {
    if (!selectedTopic) return; // No topic selected, nothing to reset

    const topicData = questionsData.find((item) => item.topic === selectedTopic);
    if (topicData) {
        renderCards(topicData.questions); // Re-render all questions for the selected topic
    }

    // Ensure all tag buttons are reset visually
    const tagButtons = document.querySelectorAll(".tag-button");
    tagButtons.forEach((button) => button.classList.remove("active")); // Optional: add visual indicator
}

// Attach the reset functionality to the reset button in the header
document.getElementById("reset-button").addEventListener("click", resetCards);


// Fetch JSON data and initialize
fetch("/questions.json")
    .then((response) => response.json())
    .then((data) => {
        questionsData = data; // Store data globally
        generateTopicButtons(data);
    })
    .catch((error) => console.error("Error loading questions:", error));
