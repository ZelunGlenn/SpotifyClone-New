const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const spotifyWebApi = require('spotify-web-api-node')
// dotenv
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req,res) =>{
  const refreshToken = req.body.refreshToken
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken
  })

  spotifyApi
    .refreshAccessToken()
    .then(
      (data) => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn
        })
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.post('/login', (req,res) => {
  const code = req.body.code
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken:data.body.access_token,
        refreshToken:data.body.refresh_token,
        expiresIn:data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })
})

app.post('/search', (req,res) => {
  const search = req.body.search
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyApi.setAccessToken(req.body.accessToken)

  spotifyApi
    .searchTracks(search)
    .then(data =>{
      res.json({
        track:data.body.tracks.items,
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})

app.post('/recentPlay', (req,res) => {
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(req.body.accessToken)
  spotifyApi.getMyRecentlyPlayedTracks({limit: 20})
    .then(data =>{
      res.json({
        track:data.body.items,
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})



app.post('/recommendationSong', (req,res) => {
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(req.body.accessToken)
  spotifyApi.getRecommendations({seed_tracks: req.body.bestSuitSongs})
    .then(data =>{
      res.json({
        track:data.body.tracks
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})

app.post('/getUserID', (req, res) => {
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(req.body.accessToken)
  spotifyApi.getMe()
    .then(data => {
      res.json({
        id: data.body.id
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})

app.post('/playList', (req, res) =>{
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(req.body.accessToken)
  spotifyApi.getUserPlaylists(req.body.playerID)
    .then(data => {
      res.json({
        track: data.body.items
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})

app.post('/songsFeature', (req,res) => {
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })
  spotifyApi.setAccessToken(req.body.accessToken)
  spotifyApi.getAudioFeaturesForTracks(req.body.songs)
    .then(data =>{
      res.json({
        features:data.body.audio_features
      })
    })
    .catch((err) =>{
      res.sendStatus(400)
    })
})

app.listen(3001)

