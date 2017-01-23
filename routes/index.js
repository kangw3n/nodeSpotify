var express = require('express');
var router = express.Router();
var axios = require('axios');
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'nodeSpotify',
		menu: 'home',
		component: 'search',
		queryType: ['track', 'album', 'artist']
	});
});

router.get('/about', function (req, res, next) {

	MongoClient.connect('mongodb://localhost:27017/nodeSpotify', function (err, db) {
		if (err) throw err

		db.collection('about').find().toArray(function (err, result) {

			if (err) throw err

			res.render('about', {
				title: result[0].about,
				menu: 'about',
				component: 'about'
			});
		})
	})


});

router.get('/track/:id', function(req, res) {
	var id = req.params.id;
	var url = `https://api.spotify.com/v1/tracks/${id}`;
	axios.get(url)
		.then(function(e) {
			var data = e.data;
			// res.json(data);

			res.render('track', {
				title: 'Track - ' + data.name,
				menu: 'track',
				component: 'track',
				data: data
			});
		}, function(err) {
			res.render('error', {
				message: 'Error Occurs',
				error: {
					status: err.statusText,
					stack: 'JSON Bad Request ' + err
				}
			});
		})

});

router.get('/album/:id', function(req, res) {
	var id = req.params.id;
	var url = `https://api.spotify.com/v1/albums/${id}`;
	axios.get(url)
		.then(function(e) {
			var data = e.data;
			// res.json(data);

			res.render('album', {
				title: 'Album - ' + data.name,
				menu: 'album',
				component: 'album',
				data: data
			});
		}, function(err) {
			res.render('error', {
				message: 'Error Occurs',
				error: {
					status: err.statusText,
					stack: 'JSON Bad Request ' + err
				}
			});
		})

});

router.get('/top-tracks/:id', function(req, res) {
	var id = req.params.id;
	var url = `https://api.spotify.com/v1/artists/${id}/top-tracks?country=TW`;
	var artistUrl = `https://api.spotify.com/v1/artists/${id}`;
	axios.get(url)
		.then(function(e) {
			var tracks = e.data.tracks;

			axios.get(artistUrl)
				.then(function(b) {
					var artist = b.data;

					res.render('toptracks', {
						title: 'Top-Tracks - ' + artist.name,
						menu: 'toptracks',
						component: 'toptracks',
						tracks: tracks,
						artist: artist
					});

				});

		}, function(err) {
			res.render('error', {
				message: 'Error Occurs',
				error: {
					status: err.statusText,
					stack: 'JSON Bad Request ' + err
				}
			});
		})

});

router.get('/artist/:id', function(req, res) {
	var id = req.params.id;
	var url = `https://api.spotify.com/v1/artists/${id}`;
	var albumUrl = `https://api.spotify.com/v1/artists/${id}/albums`;
	axios.get(url)
		.then(function(e) {
			var data = e.data;
			axios.get(albumUrl)
				.then(function(b) {
					var data2 = b.data.items;
					res.render('artist', {
						title: 'Artist - ' + data.name,
						menu: 'artist',
						component: 'artist',
						data: data,
						data2: data2
					});
				})

		}, function(err) {
			res.render('error', {
				message: 'Error Occurs',
				error: {
					status: err.statusText,
					stack: 'JSON Bad Request ' + err
				}
			});
		})

});





module.exports = router;
