// data.js - Data loading and parsing functions for Movie Recommender

/**
 * Movie data structure
 * @typedef {Object} Movie
 * @property {number} id - Movie ID
 * @property {string} title - Movie title
 * @property {string[]} genres - Array of genres
 */

/**
 * Rating data structure
 * @typedef {Object} Rating
 * @property {number} userId - User ID
 * @property {number} movieId - Movie ID
 * @property {number} rating - Rating value (1-5)
 * @property {number} timestamp - Rating timestamp
 */

// Global variables to store parsed data
let movies = [];
let ratings = [];
let allGenres = [];

/**
 * Loads and parses movie data from a string in u.item format
 * @param {string} data - The raw movie data string
 * @returns {Movie[]} Array of movie objects
 */
function parseMovieData(data) {
    const movies = [];
    const lines = data.split('\n');
    
    for (const line of lines) {
        if (line.trim() === '') continue;
        
        const parts = line.split('|');
        if (parts.length < 5) continue;
        
        const id = parseInt(parts[0]);
        const title = parts[1];
        const genres = [];
        
        // Extract genres (positions 5-23 in the u.item format)
        for (let i = 5; i < 24; i++) {
            if (parts[i] === '1') {
                // Map index to genre name
                const genreIndex = i - 5;
                const genreName = [
                    "Unknown", "Action", "Adventure", "Animation",
                    "Children's", "Comedy", "Crime", "Documentary",
                    "Drama", "Fantasy", "Film-Noir", "Horror",
                    "Musical", "Mystery", "Romance", "Sci-Fi",
                    "Thriller", "War", "Western"
                ][genreIndex];
                
                if (genreName && genreName !== "Unknown") {
                    genres.push(genreName);
                }
            }
        }
        
        movies.push({ id, title, genres });
    }
    
    return movies;
}

/**
 * Loads and parses rating data from a string in u.data format
 * @param {string} data - The raw rating data string
 * @returns {Rating[]} Array of rating objects
 */
function parseRatingData(data) {
    const ratings = [];
    const lines = data.split('\n');
    
    for (const line of lines) {
        if (line.trim() === '') continue;
        
        const parts = line.split('\t');
        if (parts.length < 4) continue;
        
        ratings.push({
            userId: parseInt(parts[0]),
            movieId: parseInt(parts[1]),
            rating: parseInt(parts[2]),
            timestamp: parseInt(parts[3])
        });
    }
    
    return ratings;
}

/**
 * Extracts all unique genres from the movies array
 * @param {Movie[]} movies - Array of movie objects
 * @returns {string[]} Array of unique genre names
 */
function extractAllGenres(movies) {
    const genreSet = new Set();
    
    for (const movie of movies) {
        for (const genre of movie.genres) {
            genreSet.add(genre);
        }
    }
    
    return Array.from(genreSet).sort();
}

/**
 * Loads movie and rating data from files (simulated for this example)
 * In a real implementation, this would use fetch or XMLHttpRequest
 * @returns {Promise<{movies: Movie[], ratings: Rating[]}>} Object containing movies and ratings
 */
async function loadMovieData() {
    try {
        // In a real implementation, we would fetch these from actual files
        // For this example, we'll use simulated data
        
        // Simulated u.item data (first 15 movies)
        const movieData = `1|Toy Story (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Toy%20Story%20(1995)|0|0|0|1|1|1|0|0|0|0|0|0|0|0|0|0|0|0|0
2|GoldenEye (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?GoldenEye%20(1995)|0|1|1|0|0|0|0|0|0|0|0|0|0|0|0|0|1|0|0
3|Four Rooms (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Four%20Rooms%20(1995)|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|1|0|0
4|Get Shorty (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Get%20Shorty%20(1995)|0|1|0|0|0|1|0|0|1|0|0|0|0|0|0|0|0|0|0
5|Copycat (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Copycat%20(1995)|0|0|0|0|0|0|1|0|1|0|0|0|0|0|0|0|1|0|0
6|Shanghai Triad (Yao a yao yao dao waipo qiao) (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Yao%20a%20yao%20yao%20dao%20waipo%20qiao%20(1995)|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0
7|Twelve Monkeys (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Twelve%20Monkeys%20(1995)|0|0|0|0|0|0|0|0|0|1|0|0|0|0|0|1|0|0|0
8|Babe (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Babe%20(1995)|0|0|0|1|1|0|0|0|1|0|0|0|0|0|0|0|0|0|0
9|Dead Man Walking (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Dead%20Man%20Walking%20(1995)|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0
10|Richard III (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Richard%20III%20(1995)|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|1|0
11|Seven (Se7en) (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Se7en%20(1995)|0|0|0|0|0|0|1|0|1|0|0|0|0|0|0|0|1|0|0
12|Usual Suspects, The (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Usual%20Suspects,%20The%20(1995)|0|0|0|0|0|0|1|0|1|0|0|0|0|0|0|0|1|0|0
13|Mighty Aphrodite (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Mighty%20Aphrodite%20(1995)|0|0|0|0|0|1|0|0|1|0|0|0|0|0|0|0|0|0|0
14|Postino, Il (1994)|01-Jan-1994||http://us.imdb.com/M/title-exact?Postino,%20Il%20(1994)|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0
15|Mr. Holland's Opus (1995)|01-Jan-1995||http://us.imdb.com/M/title-exact?Mr.%20Holland's%20Opus%20(1995)|0|0|0|0|0|0|0|0|1|0|0|0|0|0|0|0|0|0|0`;
        
        // Simulated u.data (first 20 ratings)
        const ratingData = `196	242	3	881250949
186	302	3	891717742
22	377	1	878887116
244	51	2	880606923
166	346	1	886397596
298	474	4	884182806
115	265	2	881171488
253	465	5	891628467
305	451	3	886324817
6	86	3	883603013
62	257	2	879372434
286	1014	5	879781125
200	222	5	876042340
210	40	3	891035994
224	29	3	888104457
303	785	3	879485318
122	387	5	879270459
194	274	2	882795156
291	1042	4	874834944
234	1184	2	892079237`;
        
        // Parse the data
        movies = parseMovieData(movieData);
        ratings = parseRatingData(ratingData);
        allGenres = extractAllGenres(movies);
        
        console.log('Movie data loaded successfully');
        console.log(`Loaded ${movies.length} movies and ${ratings.length} ratings`);
        
        return { movies, ratings };
    } catch (error) {
        console.error('Error loading movie data:', error);
        throw error;
    }
}

/**
 * Gets all loaded movies
 * @returns {Movie[]} Array of movie objects
 */
function getMovies() {
    return movies;
}

/**
 * Gets all loaded ratings
 * @returns {Rating[]} Array of rating objects
 */
function getRatings() {
    return ratings;
}

/**
 * Gets all unique genres
 * @returns {string[]} Array of genre names
 */
function getAllGenres() {
    return allGenres;
}

/**
 * Gets a movie by its ID
 * @param {number} id - Movie ID
 * @returns {Movie|null} Movie object or null if not found
 */
function getMovieById(id) {
    return movies.find(movie => movie.id === id) || null;
}

/**
 * Gets ratings for a specific movie
 * @param {number} movieId - Movie ID
 * @returns {Rating[]} Array of rating objects for the movie
 */
function getRatingsForMovie(movieId) {
    return ratings.filter(rating => rating.movieId === movieId);
}

/**
 * Gets average rating for a movie
 * @param {number} movieId - Movie ID
 * @returns {number} Average rating or 0 if no ratings
 */
function getAverageRating(movieId) {
    const movieRatings = getRatingsForMovie(movieId);
    if (movieRatings.length === 0) return 0;
    
    const sum = movieRatings.reduce((total, rating) => total + rating.rating, 0);
    return sum / movieRatings.length;
}

// Initialize data when the script loads
loadMovieData().catch(console.error);
