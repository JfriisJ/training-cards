// Select existing DOM elements
const topicMenuButton = document.getElementById("menu-button");
const topicDropdown = document.getElementById("dropdown");
const tagMenuButton = document.getElementById("tag-menu-button");
const tagDropdown = document.getElementById("tag-dropdown");
const tagsContainer = document.getElementById("tags-container");
const cardGrid = document.getElementById("card-grid");
const resetButton = document.getElementById("reset-button");
const randomButton = document.getElementById("random-button");
const topicHeading = document.getElementById("topic-heading");
const upButton = document.getElementById("up-button");
// Initially hide the button
// document.getElementById("up-button").style.display = "none";

let selectedTopic = null;
let questionsData = [];

// Function to set the topic heading
function updateTopicHeading() {
    topicHeading.textContent = selectedTopic
        ? `Current Topic: ${selectedTopic}`
        : "Study Card";
}

// Populate the topic menu dynamically
function generateTopicMenu(data) {
    topicDropdown.innerHTML = ""; // Clear existing menu items
    data.forEach(({ topic }) => {
        const li = document.createElement("li");
        li.textContent = topic;
        li.classList.add("dropdown-item");

        li.addEventListener("click", () => {
            selectedTopic = topic; // Update selectedTopic
            updateTopicHeading(); // Update the topic heading
            const selectedData = data.find((item) => item.topic === topic);
            if (selectedData) {
                displayTagsAndQuestions(selectedData.questions);
                topicDropdown.style.display = "none"; // Hide dropdown after selection
            }
        });

        topicDropdown.appendChild(li);
    });
}

// Generate tag dropdown dynamically
function generateTagDropdown(tags) {
    tagDropdown.innerHTML = ""; // Clear existing items

    tags.forEach((tag) => {
        const li = document.createElement("li");
        li.textContent = tag;
        li.classList.add("dropdown-item");

        li.addEventListener("click", () => {
            filterByTag(tag);
            tagDropdown.style.display = "none"; // Hide dropdown after selection
        });

        tagDropdown.appendChild(li);
    });
}

// Display tags and questions for the selected topic
function displayTagsAndQuestions(questionsData) {
    tagsContainer.style.display = "block"; // Show the tags section
    const uniqueTags = [...new Set(questionsData.flatMap((q) => q.tags))];
    generateTagDropdown(uniqueTags); // Generate dropdown for tags
    renderCards(questionsData);
}

// Show a random card from the selected topic
function showRandomCard() {
    if (!selectedTopic) {
        alert("Please select a topic first.");
        return;
    }

    const topicData = questionsData.find((item) => item.topic === selectedTopic);
    if (!topicData || topicData.questions.length === 0) {
        alert("No questions available for the selected topic.");
        return;
    }

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
    if (!selectedTopic) return;

    const topicData = questionsData.find((item) => item.topic === selectedTopic);
    if (topicData) {
        renderCards(topicData.questions); // Re-render all questions for the selected topic
    }
}

// Toggle the dropdown menu
function toggleDropdown(dropdown) {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

topicMenuButton.addEventListener("click", () => toggleDropdown(topicDropdown));
tagMenuButton.addEventListener("click", () => toggleDropdown(tagDropdown));

// Attach the reset functionality to the reset button in the header
resetButton.addEventListener("click", () => {
    resetCards();
    updateTopicHeading(); // Update heading to reflect the reset state
});

// Attach the random card functionality to the random button
randomButton.addEventListener("click", showRandomCard);

// Fetch JSON data and initialize
fetch("/questions.json")
    .then((response) => response.json())
    .then((data) => {
        questionsData = data; // Store data globally
        generateTopicMenu(data);
        updateTopicHeading(); // Set default topic heading
    })
    .catch((error) => console.error("Error loading questions:", error));



// Show the up button when scrolling down
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        upButton.style.display = "block"; // Show button after scrolling 200px
    } else {
        upButton.style.display = "none"; // Hide button when near the top
    }
});

// Scroll to the top when the up button is clicked
upButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scroll effect
    });
});