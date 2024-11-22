// page after the login
// cd server  ->  npm run devStart
// npm start

import {useState, useEffect} from 'react'
import useAuth from './useAuth'
import Player from './Player'
import Playlist from './Playlist'
import TrackSearchResult from './TrackSearchResult'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: "714d0f1e8dca437faeac64fd0b3e6926",
})

export default function Dashboard({code}){
  
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingtrack] = useState()
  const [p, setP] = useState(false)
  const [playList, setPlayList] = useState([])

  function chooseTrack(track) {
    setPlayingtrack(track)
    setSearch('')
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
    spotifyApi.searchTracks(search).then(res => {
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

  useEffect(() => {
    if(!accessToken) return
    spotifyApi.getUserPlaylists('31p6wh523i34etnrunaqdkz4etbq')
    .then(res => {
      // if(tracks.body.items.length > 0)
      // {
      //   console.log(tracks);
      // }
      // else{
      //   setPlayList([])

      // }
      setPlayList(res.body.items.map(track => {

        const smallestAlbumImage = track.images.reduce(
          (smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
        }, track.images[0])

        return {
          id: track.id,
          title:track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      }))
    })

  }, [accessToken])

  return (
    // change1
    <Container className='d-flex flex-column py-2 parent' style = {{height:"100vh"}}>


      <div className = "child row h-100"  style = {{overflowY: "auto"}}>

        {/* change1 */}
        <div className = "col-3 bg-light">
          <h1>Spotify Clone</h1>

        </div>

        {/* change1 */}
        <div className = "col-9 bg-info">
        {/* change1 */}
        
          <div>
              <Form.Control 
                type = "search"
                placeholder = "Search Songs/Artists"
                value = {search}
                onChange = {e => setSearch(e.target.value)}
              />
          </div>
          <div>
            <div className='flex-grow-1 my-2'>
              {searchResults.map(track => (
                <TrackSearchResult track={track} key = {track.uri} chooseTrack={chooseTrack}/>
              ))}
            </div>
          </div>

        {/* change1 */}
        </div>


      {/* change1 */}
      </div>
    </Container>
  )
}