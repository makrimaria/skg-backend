//imports
import express from "express"
import mongoose, { mongo } from "mongoose"

//configuration
const PORT = 5000;
const MONGO_URI = "mongodb+srv://mariaskgcode:naikalispera@backend.l0hxls2.mongodb.net/?retryWrites=true&w=majority&appName=backend"

//initialize express app
const app = express()
app.use(express.json()); //middleware to parse JSON bodies of incoming requests

//connection to mongodb
mongoose.connect(MONGO_URI).then(() => {
    console.log("Database is connected successfully!");
    app.listen(PORT, () => { //if the connection is successful it starts the server and logs a success message
        console.log("Server is running on port: " + PORT);
    });
}).catch((error) => { //logs any connection errors
    console.log(error);
});

//check connection and initialize data
mongoose.connection.on("connected", async () => { // <- event listener for successful mongodb connection
    const moviesCount = await MoviesModel.countDocuments();
    if (moviesCount == 0) { //checks if there are any movies in the collection, and if not, it calls the inserInitialMovies() function to insert the initial movie data
        insertInitialMovies();
    }
})

//define movie schema
const moviesSchema = new mongoose.Schema({
    id: Number,
    title: String,
    director: String,
    release_year: Number,
    genre: String,
    rating: Number,
    image: String
});

//define movies model
const MoviesModel = mongoose.model("movies", moviesSchema);

//the insertInitialMovies() function
const insertInitialMovies = async () => {
    try {

        const movies = [
            {
                _id: new mongoose.Types.ObjectId(),
                id: 1,
                title: "Inception",
                director: "Christopher Nolan",
                release_year: 2010,
                genre: "Science Fiction",
                rating: 8.8,
                image: "https://example.com/inception.jpg",
            },
            {
                _id: new mongoose.Types.ObjectId(),
                id: 2,
                title: "The Godfather",
                director: "Francis Ford Coppola",
                release_year: 1972,
                genre: "Crime",
                rating: 9.2,
                image: "https://example.com/thegodfather.jpg",
            },
            {
                _id: new mongoose.Types.ObjectId(),
                id: 3,
                title: "Pulp Fiction",
                director: "Quentin Tarantino",
                release_year: 1994,
                genre: "Crime",
                rating: 8.9,
                image: "https://example.com/pulpfiction.jpg",
            },
            {
                _id: new mongoose.Types.ObjectId(),
                id: 4,
                title: "The Shawshank Redemption",
                director: "Frank Darabont",
                release_year: 1994,
                genre: "Drama",
                rating: 9.3,
                image: "https://example.com/shawshank.jpg",
            },
            {
                _id: new mongoose.Types.ObjectId(),
                id: 5,
                title: "The Dark Knight",
                director: "Christopher Nolan",
                release_year: 2008,
                genre: "Action",
                rating: 9.0,
                image: "https://example.com/thedarkknight.jpg",
            },
        ];

        const insertedMovies = await MoviesModel.insertMany(movies)
        console.log("Inserted movies: " + insertedMovies)

    } catch (error) {
        console.error("Error inserting movies to the db: " + error);
    }
}

//Get all movies from db
app.get('/movies', async (req, res) => {

    try {
        const movies = await MoviesModel.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get a movie by the object id 
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await MoviesModel.findById(req.params.id);
        if(!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get a movie by our custom id field
app.get('/movies/custom/:id', async (req, res) => {
    try {
        const movie = await MoviesModel.findOne({ id: req.params.id });
        if(!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Delete a movie by id
app.delete('/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await MoviesModel.findByIdAndDelete(req.params.id);
        if(!deletedMovie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json({ message: "Movie deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Post a new movie
app.post('/movies', async (req, res) => {
    try {
        const movie = new MoviesModel({
            _id: new mongoose.Types.ObjectId(),
            id: req.body.id,
            title: req.body.title,
            director: req.body.director,
            release_year: req.body.release_year,
            genre: req.body.genre,
            rating: req.body.rating,
            image: req.body.image
        });

        movie.save();
        res.status(201).json(movie);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});