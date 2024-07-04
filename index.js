import express from "express"
import mongoose from "mongoose"

const PORT = 3000; 
const MONGO_URI = "mongodb+srv://mariaskgcode:naikalispera@backend.l0hxls2.mongodb.net/?retryWrites=true&w=majority&appName=backend"

const app = express()

mongoose.connect(MONGO_URI).then(() => {
    console.log("Database is connected successfully!");
    app.listen(PORT, () => {
        console.log("Server is running on port: " + PORT);
    });
}).catch((error) => {
    console.log(error);
});


mongoose.connection.on("connected", async () => {
    //TODO: edw tha elegksw an to collection einai adeio kai tha kanw insert ta data pou thelw

    const moviesCount = await MoviesModel.countDocuments();
    if(moviesCount == 0) {
        insertInitialMovies();
    }
})

const moviesSchema = new mongoose.Schema({
    id: Number,
    title: String,
    director: String,
    release_year: Number,
    genre: String,
    rating: Number,
    image: String
});

const MoviesModel = mongoose.model("movies", moviesSchema);

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





