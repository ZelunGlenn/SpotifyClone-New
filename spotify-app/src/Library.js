import axios from 'axios';
import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecentPlayResults from './RecentPlayResults';
import RecommendationResults from './RecommendationResults';
import Playlist from './Playlist';
const spotifyWebApi = require('spotify-web-api-node');

export default function Library({accessToken}){

  const [playList, setPlayList] = useState([])
  const [playerID, setPlayerID] = useState('')


  useEffect(() => {
    if(!accessToken) return
    axios.post('http://localhost:3001/getUserID', {
      accessToken
    })
      .then(res => {
        setPlayerID(res.data.id)
      })
  }, [accessToken])

  useEffect(() => {
    if(!accessToken) return
    if(!playerID) return

    axios.post('http://localhost:3001/playList', {
      accessToken, playerID
    })
    .then(res => {
      setPlayList(res.data.track.map(track => {

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
      // console.log(res.data)
    })
  }, [accessToken, playerID])


  return (
    <div>
      <h1>Library</h1>
      <Playlist playlist={playList}/>
    </div>
  )
}