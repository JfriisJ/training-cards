const searchBar = document.getElementById("searchbar");
const tagButtonsContainer = document.getElementById("tag-buttons");
let questions, cards; // Declare globally to update after rendering

// Function to filter cards by search keyword
searchBar.addEventListener("keyup", function (e) {
    const keyword = e.target.value.toLowerCase();

    questions.forEach((question) => {
        const questionTitle = question.textContent.toLowerCase();
        const card = question.closest(".card");
        card.style.display = questionTitle.includes(keyword) ? "block" : "none";
    });
});

// Function to filter cards by tag
function filterCardsByTag(tag) {
    cards.forEach((card) => {
        card.style.display = card.dataset.tags.includes(tag.toLowerCase()) ? "block" : "none";
    });
}

// Function to reset card visibility
function resetCards() {
    cards.forEach((card) => {
        card.style.display = "block";
    });
}

// Function to dynamically generate tag buttons
function generateTagButtons(tags) {
    tagButtonsContainer.innerHTML = ""; // Clear existing buttons

    const uniqueTags = [...new Set(tags.flat().map(tag => tag.toLowerCase()))]; // Flatten and get unique tags
    uniqueTags.forEach(tag => {
        const button = document.createElement("button");
        button.classList.add("tag-button");
        button.textContent = tag;
        button.addEventListener("click", () => filterCardsByTag(tag)); // Attach filtering logic
        tagButtonsContainer.appendChild(button);
    });

    // Add RESET button
    const resetButton = document.createElement("button");
    resetButton.classList.add("reset-button");
    resetButton.textContent = "RESET";
    resetButton.addEventListener("click", resetCards);
    tagButtonsContainer.appendChild(resetButton);
}

// Function to render cards
function renderCards(data) {
    const cardGrid = document.getElementById("card-grid");
    cardGrid.innerHTML = ""; // Clear existing cards

    const allTags = []; // Collect all tags for dynamic button generation

    data.forEach(({ question, answer, tags }) => {
        allTags.push(tags); // Collect tags for the current card

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-tags", tags.map(tag => tag.toLowerCase()).join(","));
        card.innerHTML = `
      <div class="card-inner flip-inverted-diagonal">
        <div class="card-front">
          <h2 class="question">${question}</h2>
        </div>
        <div class="card-back back-flip-inverted-diagonal">
          <p class="answer">${answer}</p>
          <div class="tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
      </div>
    `;
        cardGrid.appendChild(card);
    });

    // Update questions and cards references after rendering
    questions = document.querySelectorAll(".question");
    cards = document.querySelectorAll(".card");

    // Generate tag buttons dynamically
    generateTagButtons(allTags);
}

// Fetch JSON data and initialize
fetch("topics/questions.json") // Use your actual path
    .then((response) => response.json())
    .then((data) => {
        renderCards(data);
    })
    .catch((error) => console.error("Error loading questions:", error));
