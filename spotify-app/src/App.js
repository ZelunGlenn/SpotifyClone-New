import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { Container, Form } from 'react-bootstrap';
import Login from './Login';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import Search from './Search';
import Home from './Home';
import Library from './Library';
import Habit from './Habit';
import Graph from './Graph';
import './style.css';


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
})
const code = new URLSearchParams(window.location.search).get('code')

// function App() {
//   return code ? <Dashboard code={code} /> : <Login />
// }



function App() {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingtrack] = useState()
  const [p, setP] = useState(false)
  const [playList, setPlayList] = useState([])
  const [trackUri, setTrackUri] = useState()

  function chooseTrack(track) {
    setPlayingtrack(track)
    setSearch('')
  }

  const getTrackUri = function (playingTrackUri) {
    setTrackUri(playingTrackUri);
  }

  useEffect(() => {
    if(!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  const clickHandler = (e) => {
    if (p) {
      setP(false)
      return
    }
    setSearch("");
    setP (true);
  }
  
  useEffect(() => {
    if(!search) return setSearchResults([])
    if(!accessToken) return
    let cancel = false
    spotifyApi.searchTracks(search)
      .then(res => {
        if (cancel) return
        setSearchResults(res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
          }, track.album.images[0])

          return {
            artist: track.artists[0].name,
            title:track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          }
        }))
      })
    return () => cancel = true
  }, [search, accessToken])



  if (code) {
    // take the accesstoken for access purposes
    // do player and do mavigation bar first
    // then move on to the content due to different pages is acitive
    return (
      
      //   {/* // change1 */}
        <Container className='d-flex flex-column py-2 parent' style = {{height:"100vh"}}>
          <Router>
    
          {/* // change2
          // {/* <button onClick={clickHandler}>My Play List</button> */}
    
          {/* temp
          <div> */}
     
          {/* // change1 */}
          <div className = "child row h-100"  style = {{overflowY: "auto"}}>
    
            {/* change1 */}
            <div className = "col-4" id = "nav">
              <h1 className='text-light text-center' id = "title">Spotify Clone</h1>

              <div className='text-center'>
                <div class="container">
                  <Link to='/Home' class = "link">Home</Link>
                </div>
                <div class="container">
                <Link to='/Search' class = "link">Search</Link>
                </div>
                <div class="container">
                <Link to='/Library' class = "link">Library</Link>
                </div>
                <div class="container">
                <Link to='/Graph' class = "link">Listening Habits</Link>
                </div>
                {/* <Link to='/Habit'>Listen Habits</Link> */}
              </div>
            </div>

            {/* change1 */}
            <div className = "col-8" id = "body">
            {/* change1 */}

            <Routes>
                  <Route path='/Home' element={<Home accessToken={accessToken} getTrackUri={getTrackUri}/>}/>
                  <Route path='/Search' element={<Search accessToken={accessToken} getTrackUri={getTrackUri}/>}/>
                  <Route path='/Library' element={<Library accessToken={accessToken}/>}/>
                  <Route path='/Graph' element={<Graph accessToken={accessToken} spotifyApi={spotifyApi}/>}/>
                  {/* <Route path='/Habit' element={<Habit accessToken={accessToken} spotifyApi={spotifyApi}/>}/> */}
            </Routes>

    
            {/* change1 */}
            </div>
    
    
          {/* change1 */}
          </div>
          
          
    
        
    
          {/* change1 */}
          <div><Player accessToken={accessToken} trackUri={trackUri}/></div>
    
          {/* temp */}
          {/* </div> */}
         
            {/* <Routes>
                  <Route path='/a' element={<Search />}/>
            </Routes> */}
         </Router>
        </Container>
       
      
    )
    
    // return <Dashboard code={code} />
  } else {
    return <Login />
  }
  // return code ? <Dashboard code={code} /> : <Login />
}

export default App
