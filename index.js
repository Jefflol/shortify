const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Url = require('./models/url');

// CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// DISPLAY URLS
app.get('/' , async (req, res) => {
    const urls = await Url.find().limit(5).sort({ date: -1 });
    res.render('index', { urls: urls });
});

// STATIC DIRECTORY
app.use('/css', express.static('public/css'));

// ROUTES
app.use('/', require('./routes/index.js'));
app.use('/api/url', require('./routes/url.js'));

const PORT = 5000;

app.listen(process.env.PORT || PORT, () => console.log(`Server running on port ${PORT}`));