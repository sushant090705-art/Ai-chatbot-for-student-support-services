// ==========================================================================
// CYBERPUNK TECH AI PORTAL - FAQ INTERACTION SCRIPT
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    const faqQuestions = document.querySelectorAll(".faq-question");
    const searchBar = document.getElementById("searchBar");
    const faqItems = document.querySelectorAll(".faq-item");
    const noResults = document.getElementById("no-results");
    const pillBtns = document.querySelectorAll(".pill-btn");

    let currentFilter = "all";

    // 1. Accordion Toggle Logic
    faqQuestions.forEach(button => {
        button.addEventListener("click", () => {
            const faqItem = button.parentElement;
            const answerPanel = button.nextElementSibling;
            const isCurrentlyActive = faqItem.classList.contains("active");

            // Close all items
            faqItems.forEach(item => {
                item.classList.remove("active");
                const panel = item.querySelector(".faq-answer");
                if (panel) panel.style.maxHeight = null;
            });

            // Toggle selected item if it wasn't active
            if (!isCurrentlyActive) {
                faqItem.classList.add("active");
                if (answerPanel) {
                    answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
                }
            }
        });
    });

    // 2. Filter & Search Combined Handler
    function filterFaqItems() {
        const searchString = searchBar ? searchBar.value.toLowerCase().trim() : "";
        let visibleCount = 0;

        faqItems.forEach(item => {
            const category = item.getAttribute("data-category") || "";
            const questionText = item.querySelector(".q-text") ? item.querySelector(".q-text").textContent.toLowerCase() : "";
            const answerText = item.querySelector(".faq-answer-content") ? item.querySelector(".faq-answer-content").textContent.toLowerCase() : "";

            const matchesCategory = (currentFilter === "all" || category === currentFilter);
            const matchesSearch = searchString === "" || questionText.includes(searchString) || answerText.includes(searchString);

            if (matchesCategory && matchesSearch) {
                item.style.display = "block";
                visibleCount++;
            } else {
                item.style.display = "none";
                item.classList.remove("active");
                const panel = item.querySelector(".faq-answer");
                if (panel) panel.style.maxHeight = null;
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    // Search bar input listener
    if (searchBar) {
        searchBar.addEventListener("keyup", filterFaqItems);
        searchBar.addEventListener("input", filterFaqItems);
    }

    // Category Pill Buttons click handler
    pillBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            pillBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter") || "all";
            filterFaqItems();
        });
    });

});
