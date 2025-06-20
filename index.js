import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory array to store anime (temporary until MongoDB)
let animeList = [
  { title: "Naruto", rating: 9 },
  { title: "One Piece", rating: 10 },
  { title: "Death Note", rating: 8.5 }
];

const MONGO_URI = 'mongodb+srv://bidyut:1234@cluster0.eprutlh.mongodb.net'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDb Connected");
  
}).catch(() => {
  console.log("MongoDb connection error:");
  
});

// Middleware
app.use(cors());
app.use(express.json());

// Anime Schema & model
const animeSchema = new 
mongoose.Schema({
  title:String,
  rating: Number
});

const Anime = mongoose.model('Anime', animeSchema);


// This is for Cannot get/ Problem
app.get('/', (req, res) => {
  res.send('Backend is Working! Visit /api/anime for data,');
})

// GET: return full anime list
app.get('/api/anime', async (req, res) => {
  try {
    const animeList = await Anime.find();
    res.json(animeList);
  } catch (err) {
    res.status(500).json({ message:
      "Error fetching anime"
    });
  }
});

// POST: add new anime
app.post('/api/anime', async (req, res) => {
  const {title, rating} = req.body;

  if (!title || typeof rating !== 'number') {
    return 
res.status(400).json({message: 'Invalid data'});
  }

  try {
    const newAnime = new Anime ({title, rating});
    await newAnime.save();
    res.json({message: 'Anime saved to MongoDb!'});
  } catch (err) {
    res.status(500).json({message:
      'Failed to save anime'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});


