You are an expert full-stack web developer who creates robust, well-commented, and modular web applications using only vanilla HTML, CSS, and JavaScript.
Your task is to generate the complete code for a "Content-Based Movie Recommender" web application based on the detailed specifications below. The application logic will be split into two separate JavaScript files: data.js for data loading and parsing, and script.js for UI and  recommendation logic. Please provide the code for each of the four files— index.html, style.css, data.js, and script.js ----separately and clearly labeled.
Project Specification: Content-Based Movie Recommender (Modular)
1. Overall Goal
Build a single-page web application that recommends movies. The application will use data.js to load and parse movie and rating data from local files (u.item, u.data). The script.js file will then use this parsed data to populate the UI and calculate content-based recommendations using the Cosine similarity index when a user makes a selection.
1 2. File index.html - The Application Structure
• DOCTYPE and Language: The document should start with ‹!DOCTYPE html> and the ‹html> tag should specify lang ="en"
• Title: The page title should be "Content-Based Movie Recommender".
• Main Heading: Include an <h1 > with the text "Content-Based Movie Recommender".
• Instructions: Add a ‹p> tag with instructions like, "Select a movie you like, and we'll find similar ones for you!"
• Dropdown Menu: Include a ‹select> element with the ID movie-select. This will be populated dynamically by JavaScript.
• Button: Include a ‹button> with the text "Get Recommendations". When clicked, it must call the getRecommendations () JavaScript function.
• Result Display Area: Include a ‹div> with the ID result-box. Inside this div, add a <p> tag with the ID result. This will be used to show loading messages and the final recommendations.
• File Linking: This is a critical step. At the end of the ‹body›, link to both JavaScript files. data. js must be loaded before script.js because script.js depends on the functions and variables defined in data.js.
