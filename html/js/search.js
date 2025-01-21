document.addEventListener("DOMContentLoaded", () => {
    const topicMenuButton = document.getElementById("menu-button");
    const topicDropdown = document.getElementById("dropdown");
    const tagMenuButton = document.getElementById("tag-menu-button");
    const tagDropdown = document.getElementById("tag-dropdown");
    const resetButton = document.getElementById("reset-button");
    const randomButton = document.getElementById("random-button");
    const upButton = document.querySelector(".up-button");

    let selectedTopic = null;
    let questionsData = [];

    // Toggle dropdown visibility
    function toggleDropdown(dropdown) {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".topic-menu")) topicDropdown.style.display = "none";
        if (!e.target.closest(".tag-menu")) tagDropdown.style.display = "none";
    });

    topicMenuButton.addEventListener("click", () => toggleDropdown(topicDropdown));
    tagMenuButton.addEventListener("click", () => toggleDropdown(tagDropdown));

    // Reset button functionality
    resetButton.addEventListener("click", () => {
        resetCards();
        updateTopicHeading();
        console.log("Reset button clicked");
    });

    // Random card button functionality
    randomButton.addEventListener("click", () => {
        showRandomCard();
        console.log("Random card button clicked");
    });

    // Scroll to top functionality
    upButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Show "up" button when scrolling
    window.addEventListener("scroll", () => {
        upButton.style.display = window.scrollY > 200 ? "block" : "none";
    });

    // Function to update the topic heading
    function updateTopicHeading() {
        const topicHeading = document.getElementById("topic-heading");
        topicHeading.textContent = selectedTopic
            ? `Current Topic: ${selectedTopic}`
            : "Study Card";
    }

    // Generate the topic menu dynamically
    function generateTopicMenu(data) {
        topicDropdown.innerHTML = "";
        data.forEach((topic) => {
            const li = document.createElement("li");
            li.textContent = topic;
            li.classList.add("dropdown-item");
            li.addEventListener("click", () => selectTopic(topic));
            topicDropdown.appendChild(li);
        });
    }

    // Handle topic selection and fetch corresponding JSON file
    function selectTopic(topic) {
        selectedTopic = topic;
        updateTopicHeading();
        fetch(`/topics/${topic.toLowerCase().replace(/\s+/g, "_")}.json`)
            .then((response) => response.json())
            .then((data) => {
                questionsData = data.questions;
                displayTagsAndQuestions(questionsData);
                topicDropdown.style.display = "none";
            })
            .catch((error) => console.error(`Error loading topic file: ${topic}`, error));
    }

    // Generate tag dropdown dynamically
    function generateTagDropdown(tags) {
        tagDropdown.innerHTML = "";
        tags.forEach((tag) => {
            const li = document.createElement("li");
            li.textContent = tag;
            li.classList.add("dropdown-item");
            li.addEventListener("click", () => filterByTag(tag));
            tagDropdown.appendChild(li);
        });
    }

    // Display tags and questions for the selected topic
    function displayTagsAndQuestions(questions) {
        const tagsContainer = document.getElementById("tags-container");
        tagsContainer.style.display = "block";
        const uniqueTags = [...new Set(questions.flatMap((q) => q.tags))];
        generateTagDropdown(uniqueTags);
        renderCards(questions);
    }

    // Show a random card from the selected topic
    function showRandomCard() {
        if (!selectedTopic) {
            alert("Please select a topic first.");
            return;
        }

        if (!questionsData || questionsData.length === 0) {
            alert("No questions available for the selected topic.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * questionsData.length);
        renderCards([questionsData[randomIndex]]);
    }

    // Render cards dynamically
    function renderCards(data) {
        const cardGrid = document.getElementById("card-grid");
        cardGrid.innerHTML = "";
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
                        <div class="tags">
                            ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                        </div>
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

    // Reset cards to show all questions for the selected topic
    function resetCards() {
        if (!selectedTopic) return;
        renderCards(questionsData);
    }

    // Fetch available topics and initialize the menu
    fetch("/topics/questions.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load questions.json");
            }
            return response.json();
        })
        .then((data) => {
            if (data.topics && Array.isArray(data.topics)) {
                generateTopicMenu(data.topics);
            } else {
                console.error("Invalid questions.json structure");
            }
        })
        .catch((error) => console.error("Error loading topics:", error));
    });
