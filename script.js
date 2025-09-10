// script.js - UI and Recommendation Logic for Movie Recommender

// Global variables
let movies = [];
let allGenres = [];
let selectedMovie = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load movie data
    loadMovieData().then(() => {
        // Populate the dropdown with movies
        populateMovieDropdown();
        
        // Add event listeners
        document.getElementById('movie-select').addEventListener('change', handleMovieSelection);
        document.getElementById('recommend-btn').addEventListener('click', getRecommendations);
        
        // Show initial message
        document.getElementById('result').innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to the Movie Recommender!</h2>
                <p>Select a movie from the dropdown and click "Get Recommendations" to discover similar movies.</p>
                <p>We'll analyze the genres and find the best matches for you!</p>
            </div>
        `;
    }).catch(error => {
        console.error('Error loading movie data:', error);
        document.getElementById('result').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Data</h2>
                <p>There was a problem loading the movie data. Please refresh the page to try again.</p>
            </div>
        `;
    });
});

// Handle movie selection from dropdown
function handleMovieSelection(event) {
    const movieId = parseInt(event.target.value);
    if (movieId) {
        selectedMovie = getMovieById(movieId);
        
        // Show the selected movie info
        document.getElementById('selected-movie').innerHTML = `
            <div class="selected-movie-card">
                <h3>Selected Movie:</h3>
                <div class="movie-info">
                    <h4>${selectedMovie.title}</h4>
                    <p>Genres: ${selectedMovie.genres.join(', ')}</p>
                </div>
            </div>
        `;
    } else {
        selectedMovie = null;
        document.getElementById('selected-movie').innerHTML = '';
    }
}

// Get recommendations based on selected movie
function getRecommendations() {
    if (!selectedMovie) {
        showError('Please select a movie first!');
        return;
    }
    
    // Show loading state
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="loading">
            <h3>Finding recommendations for "${selectedMovie.title}"</h3>
            <div class="spinner"></div>
            <p>Analyzing genres and calculating similarities...</p>
        </div>
    `;
    
    // Calculate recommendations with a slight delay for better UX
    setTimeout(() => {
        try {
            const recommendations = calculateRecommendations(selectedMovie);
            displayRecommendations(recommendations);
        } catch (error) {
            console.error('Error calculating recommendations:', error);
            showError('There was an error calculating recommendations. Please try again.');
        }
    }, 1000);
}

// Calculate movie recommendations using cosine similarity
function calculateRecommendations(selectedMovie) {
    // Get the selected movie's genre vector
    const selectedMovieVector = createGenreVector(selectedMovie.genres);
    
    // Calculate similarity for all other movies
    const moviesWithScores = movies.map(movie => {
        if (movie.id === selectedMovie.id) {
            return { ...movie, similarity: 1 }; // Same movie
        }
        
        const movieVector = createGenreVector(movie.genres);
        const similarity = calculateCosineSimilarity(selectedMovieVector, movieVector);
        
        return { ...movie, similarity };
    });
    
    // Sort by similarity (descending) and exclude the selected movie
    return moviesWithScores
        .filter(movie => movie.id !== selectedMovie.id)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 6); // Get top 6 recommendations
}

// Create a binary genre vector for a movie
function createGenreVector(movieGenres) {
    return allGenres.map(genre => movieGenres.includes(genre) ? 1 : 0);
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA, vectorB) {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
    }
    
    // Calculate magnitudes
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    
    // Avoid division by zero
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
    const resultElement = document.getElementById('result');
    
    if (recommendations.length === 0) {
        resultElement.innerHTML = `
            <div class="no-results">
                <h3>No Recommendations Found</h3>
                <p>We couldn't find any similar movies for "${selectedMovie.title}".</p>
            </div>
        `;
        return;
    }
    
    let resultsHTML = `
        <h2>Movies similar to "${selectedMovie.title}":</h2>
        <div class="recommendation-summary">
            <p>Found ${recommendations.length} recommendations based on genre similarity:</p>
        </div>
        <div class="movie-grid">
    `;
    
    recommendations.forEach(movie => {
        // Get average rating for this movie
        const avgRating = getAverageRating(movie.id);
        const ratingStars = generateRatingStars(avgRating);
        
        resultsHTML += `
            <div class="movie-card">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-genres">${movie.genres.join(', ')}</div>
                <div class="movie-rating">
                    ${ratingStars}
                    <span>(${avgRating.toFixed(1)})</span>
                </div>
                <span class="similarity">Similarity: ${(movie.similarity * 100).toFixed(1)}%</span>
            </div>
        `;
    });
    
    resultsHTML += `
        </div>
        <div class="recommendation-footer">
            <p>Recommendations are based on cosine similarity of genre vectors.</p>
        </div>
    `;
    
    resultElement.innerHTML = resultsHTML;
}

// Generate star rating HTML
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<span class="star half">★</span>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star">★</span>';
    }
    
    return starsHTML;
}

// Show error message
function showError(message) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Populate the movie dropdown
function populateMovieDropdown() {
    const movieSelect = document.getElementById('movie-select');
    
    // Clear existing options except the first one
    while (movieSelect.options.length > 1) {
        movieSelect.remove(1);
    }
    
    // Add movies to dropdown
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = movie.title;
        movieSelect.appendChild(option);
    });
}

// Add some additional styles dynamically for elements not in the CSS
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .welcome-message {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
            border-radius: 10px;
            color: white;
        }
        
        .welcome-message h2 {
            margin-bottom: 15px;
            color: white;
        }
        
        .selected-movie-card {
            background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            color: white;
        }
        
        .movie-info h4 {
            margin-bottom: 5px;
            color: white;
        }
        
        .star {
            color: #ffd700;
            font-size: 1.2rem;
        }
        
        .star.half {
            position: relative;
        }
        
        .star.half:after {
            content: '★';
            position: absolute;
            left: 0;
            width: 50%;
            overflow: hidden;
            color: #ffd700;
        }
        
        .movie-rating {
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .recommendation-summary, .recommendation-footer {
            text-align: center;
            margin: 15px 0;
            color: #666;
        }
        
        .error-message, .no-results {
            text-align: center;
            padding: 30px;
            background: rgba(255, 107, 129, 0.1);
            border-radius: 10px;
            color: #ff6b81;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();
