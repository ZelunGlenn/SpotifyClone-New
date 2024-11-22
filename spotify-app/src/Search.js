import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import TrackSearchResult from './TrackSearchResult';
import axios from 'axios';

export default function Search({accessToken, getTrackUri}){
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingtrack] = useState()

  function chooseTrack(track) {
    setPlayingtrack(track)
    setSearch('')
    getTrackUri(track?.uri)
  }



  useEffect(() => {
    if(!search) return setSearchResults([])
    if(!accessToken) return
    let cancel = false

    // change1
    axios.post('http://localhost:3001/search', {
      search, accessToken
    })
      .then(res=>{
        if (cancel) return
        // console.log(res);
        setSearchResults(res.data.track.map(track => {
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

  return (
    <div>
      <div>
        <Form.Control 
          style={{ backgroundColor: 'lightgreen', color: 'black', borderRadius: '2px' }}
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
    </div>
  )
}