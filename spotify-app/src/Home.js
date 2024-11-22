import axios from 'axios';
import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecentPlayResults from './RecentPlayResults';
import RecommendationResults from './RecommendationResults';
import { FaHeart } from "react-icons/fa";

export default function Home({accessToken, getTrackUri}){
  const [recentPlay, setRecentPlay] = useState([])
  const [playingTrack, setPlayingtrack] = useState()

  const [rawRecentPlay, setRawRecentPlay] = useState([])
  const [morningSongs, setMorningSongs] = useState([])
  const [noonSongs, setNoonSongs] = useState([])
  const [nightSongs, setNightSongs] = useState([])
  const [recoSongs, setRecoSongs] = useState([])
  const [checkRawFinished, setCheckRawFinished] = useState(false)
  const [checkSongs, setCheckSongs] = useState(false)
  const [timePeriods, setTimePeriods] = useState({})
  const [tempTimePeriods, setTempTimePeriods] = useState('')
  const [bestSuitSongs, setBestSuitSongs] = useState([])
  const [Songs, setSongs] = useState(false)
  const [checkSongsBack, setCheckSongsBack] = useState(false)

  function chooseTrack(track) {
    setPlayingtrack(track)
    getTrackUri(track?.uri)
  }

  useEffect(() =>{
    if(!accessToken) return
    axios.post('http://localhost:3001/recentPlay', {
      accessToken
    })
      .then(res=>{
        // console.log(res.data.track[0].track);
        setRecentPlay(res.data.track.map(track => {
          const smallestAlbumImage = track.track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
          }, track.track.album.images[0])

          return {
            artist: track.track.artists[0].name,
            title:track.track.name,
            uri: track.track.uri,
            albumUrl: smallestAlbumImage.url
          }
        }))
        setRawRecentPlay(res.data.track.map(track => {
          const smallestAlbumImage = track.track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
          }, track.track.album.images[0])

          return {
            artist: track.track.artists[0].name,
            title:track.track.name,
            uri: track.track.uri,
            albumUrl: smallestAlbumImage.url,
            time: new Date(track.played_at).getHours(),
            seed: track.track.id
            // time: track.played_at
          }
        }))
        setCheckRawFinished(true);
      })
  }, [accessToken])

  useEffect(() =>{
    if(!checkRawFinished) return
    setMorningSongs(
      rawRecentPlay.filter(track => {
        return (track.time >= 6 && track.time < 12)
      })
    )
    setNoonSongs(
      rawRecentPlay.filter(track => {
        return (track.time >= 12 && track.time <= 18)
      })
    )
    setNightSongs(
      rawRecentPlay.filter(track => {
        // console.log(new Date().getHours())
        return ((track.time > 18 && track.time <= 23) || (track.time >= 0 && track.time < 6))
      })
    )
    setCheckSongs(true);
  }, [checkRawFinished, rawRecentPlay])


  // this will run every hour
  useEffect(() =>{
    // const interval = setInterval(() => {
      let currentTime = new Date().getHours()
      // console.log(currentTime)
      if(currentTime >= 6 && currentTime < 12){
        setTempTimePeriods({time : currentTime, duration : 'morning'})
      } else if (currentTime >= 12 && currentTime <= 18){
        setTempTimePeriods({time : currentTime, duration : 'noon'})
      } else {
        setTempTimePeriods({time : currentTime, duration : 'evening'})
      }

  }, [new Date().getHours() != tempTimePeriods.time ? tempTimePeriods : null])

  useEffect(() => {
    if(timePeriods !== tempTimePeriods.duration){
        // console.log(tempTimePeriods.duration)
        setTimePeriods(tempTimePeriods.duration)
        // console.log(timePeriods)
    }
  }, [tempTimePeriods])

  useEffect(() =>{
    if (!checkSongs) return
    if (!timePeriods) return

    if(timePeriods === "morning"){

      let temp = morningSongs.slice(0,3).map(track => {
        return track.seed
      })

      // setBestSuitSongs(temp)

      temp.push(noonSongs[0].seed)
      temp.push(nightSongs[0].seed)
      setBestSuitSongs(temp);

    } else if (timePeriods === "noon"){

      let temp = noonSongs.slice(0,3).map(track => {
        return track.seed
      })

      //setBestSuitSongs(temp)
      temp.push(morningSongs[0].seed)

      // setBestSuitSongs(prevArray => [...prevArray, ...temp])

      temp.push(nightSongs[0].seed)
      setBestSuitSongs(temp);

    } else if (timePeriods === "evening"){

      // console.log(morningSongs);
      let temp;
      temp = nightSongs.slice(0,3).map(track => {
        return track.seed
      })

      // setBestSuitSongs(temp)
      temp.push(noonSongs[0].seed)
      //setBestSuitSongs(prevArray => [...prevArray, ...temp])
      temp.push(morningSongs[0].seed)

      setBestSuitSongs(temp);
    }
  }, [checkSongs, timePeriods])

  useEffect(() => {
    if (!accessToken) return
    if (bestSuitSongs.length <= 0) return
    if (!timePeriods) return

    // console.log(bestSuitSongs);

    axios.post('http://localhost:3001/recommendationSong', {
      accessToken, bestSuitSongs
    })
      .then(res =>{
        setRecoSongs(res.data.track.map(track => {
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

        setCheckSongsBack(true)
      })
  }, [accessToken, bestSuitSongs, timePeriods])

  return (
    <div>
      <h1 id = 'time'>{(new Date().getHours() >= 6 && new Date().getHours() < 12)? 'Good Morning ': 
      (new Date().getHours() >= 12 && new Date().getHours() <= 18)? 'Good Afternoon ': 
      ((new Date().getHours() > 18 && new Date().getHours() <= 23) || (new Date().getHours() >= 0 && new Date().getHours() < 6))? 'Good Evening ': null}
      <FaHeart size={40} color="#1DB954"/></h1>
      {/* top play lists */}
      <div className='flex-grow-1 my-2'>
        <h3>Recently Played</h3>
        {
          recentPlay.slice(0,3).map((track, index) => (
            <RecentPlayResults track={track} key = {index} chooseTrack={chooseTrack}/>
          ))
        }
      </div>
      
      <div className='flex-grow-1 my-2'>
        <h3>recommendation for you</h3>
        {
          // first test morning songs print out
          recoSongs.map((track, index) => (
            // <div>{track.title}</div>
            <RecommendationResults track = {track} key = {index} chooseTrack = {chooseTrack}/>
          ))
        }

      </div>
      
    </div>
  )
}