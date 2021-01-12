const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');

const Url = require('../models/url');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASE_URL;

    // Check base URL
    if (!validUrl.isUri(baseUrl)) {
        return res.status(400).json('Invalid base URL');
    }

    // Create url code
    const urlCode = shortid.generate();

    // Check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            if (url) {
                res.redirect('/');
                // return res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    urlCode,
                    longUrl,
                    shortUrl,
                    date: new Date()
                });

                await url.save();

                res.redirect('/');
                // res.json(url);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        res.status(400).redirect('/');
        // res.status(400).json('Invalid long URL');
    }

});

module.exports = router;