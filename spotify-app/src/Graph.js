import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, PureComponent} from 'react';
import { Form } from 'react-bootstrap';
import TrackSearchResult from './TrackSearchResult';
import axios from 'axios';
import { useFetcher } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const spotifyWebApi = require('spotify-web-api-node')
export default function Graph({accessToken, spotifyApi}){

  const [rencentPlay, setRecentPlay] = useState([])

  const [morningSongs, setMorningSongs] = useState([])
  const [preMorningSongs, setPreMorningSongs] = useState([])
  const [recMorningSongs, setRecMorningSongs] = useState([])
  const [cm, setCM] = useState(false)
  const [mSongsFeatures, setmSongsFeatures] = useState([])
  const [ccm, setCCM] = useState(false)
  // const [mCheck, setMCheck] = useState(false)

  const [noonSongs, setNoonSongs] = useState([])
  const [preNoonSongs, setPreNoonSongs] = useState([])
  const [recNoonSongs, setRecNoonSongs] = useState([])
  const [cn, setCN] = useState(false)
  const [nSongsFeatures, setnSongsFeatures] = useState([])
  const [ccn, setCCN] = useState(false)

  const [nightSongs, setNightSongs] = useState([])
  const [preNightSongs, setPreNightSongs] = useState([])
  const [recNightSongs, setRecNightSongs] = useState([])
  const [ci, setCI] = useState(false)
  const [iSongsFeatures, setiSongsFeatures] = useState([])
  const [cci, setCCI] = useState(false)

  const [danceAverage, setDanceAverage] = useState([])
  const [sd, setSD] = useState(false)
  const [energyAverage, setEnergyAverage] = useState([])
  const [livenessAverage, setLivenessAverage] = useState([])
  const [loudnessAverage, setLoudnessAverage] = useState([])
  const [aveDone, setAveDone] = useState(false)
  const [barChartData1, setBarChartData1] = useState([])
  const [barChartData2, setBarChartData2] = useState([])
  const [barChartData3, setBarChartData3] = useState([])
  const [barChartData4, setBarChartData4] = useState([])
  

  const [cateSongs, setCateSongs] = useState(false)

  const [morningSongsFeatures, setMorningSongsFeatures] = useState([])
  const [morningDone, setMorningDone] = useState(false)

  useEffect(() =>{
    if(!accessToken) return
    axios.post('http://localhost:3001/recentPlay', {
      accessToken
    })
      .then(res=>{
        // console.log(res.data.track[0].track);
        setRecentPlay(res.data.track.map(track => {
          return {
            time: new Date(track.played_at).getHours(),
            seed: track.track.id
          }
        }))
      })
  }, [accessToken])

  useEffect(() => {
    if(rencentPlay.length <= 0) return
    setMorningSongs(
      rencentPlay.filter(track => {
        return (track.time >= 6 && track.time < 12)
      })
    )
    setNoonSongs(
      rencentPlay.filter(track => {
        return (track.time >= 12 && track.time <= 18)
      })
    )
    setNightSongs(
      rencentPlay.filter(track => {
        // console.log(new Date().getHours())
        return ((track.time > 18 && track.time <= 23) || (track.time >= 0 && track.time < 6))
      })
    )
    setCateSongs(true)
  }, [rencentPlay])

  useEffect(() => {
    if(morningSongs.length <= 0 && noonSongs.length <= 0 && nightSongs.length <= 0) return

    // set morning pre songs
    let temp = morningSongs.slice(0,3).map(track => {
      return track.seed
    })

    temp.push(noonSongs[0].seed)
    // setBestSuitSongs(prevArray => [...prevArray, ...temp])
    temp.push(nightSongs[0].seed)

    // console.log("tem", temp)
    setPreMorningSongs(temp);

    // noon
    let tempNoon = noonSongs.slice(0,3).map(track => {
      return track.seed
    })

    // setBestSuitSongs(temp)

    tempNoon.push(morningSongs[0].seed)
    // setBestSuitSongs(prevArray => [...prevArray, ...temp])
    tempNoon.push(nightSongs[0].seed)
    setPreNoonSongs(tempNoon);


    // night
    let tempNight = nightSongs.slice(0,3).map(track => {
      return track.seed
    })

    // setBestSuitSongs(temp)

    tempNight.push(noonSongs[0].seed)
    // setBestSuitSongs(prevArray => [...prevArray, ...temp])
    tempNight.push(morningSongs[0].seed)
    setPreNightSongs(tempNight);
  }, [morningSongs, noonSongs, nightSongs]);

  useEffect(() => {
    if(!accessToken) return
    if(preMorningSongs.length <= 0) return
    let bestSuitSongs = preMorningSongs
    axios.post("http://localhost:3001/recommendationSong", {
      accessToken, bestSuitSongs
    })
      .then(res => {
        setRecMorningSongs(res.data.track.map(
          track => track.id
        ))
        setCM(true)
      })
  }, [accessToken, preMorningSongs])

  useEffect(() => {
    if (!accessToken) return
    if (!cm) return
    if (preNoonSongs.legnth <= 0) return
    let bestSuitSongs = preNoonSongs
    axios.post("http://localhost:3001/recommendationSong", {
      accessToken, bestSuitSongs
    })
      .then(res => {
        setRecNoonSongs(res.data.track.map(
          track => track.id
        ))
        setCN(true)
      })
  },[accessToken, cm, preNoonSongs])

  useEffect(() => {
    if (!accessToken) return
    if (!cn) return
    if (preNightSongs.legnth <= 0) return
    let bestSuitSongs = preNightSongs
    axios.post("http://localhost:3001/recommendationSong", {
      accessToken, bestSuitSongs
    })
      .then(res => {
        setRecNightSongs(res.data.track.map(
          track => track.id
        ))
        setCI(true)
      })
  },[accessToken, cn, preNightSongs])

  useEffect(() => {
    if(!accessToken) return
    if(!cm) return
    if(recMorningSongs.length < 20) return
    let songs = recMorningSongs
    // console.log(songs)
    axios.post("http://localhost:3001/songsFeature", {
      accessToken, songs
    })
      .then(res => {
        setmSongsFeatures(res.data.features.map(features => {
          return {
            danceability: features.danceability,
            energy: features.energy,
            liveness: features.liveness,
            loudness: features.loudness
          }
        }))
        setCCM(true)
      })

  }, [accessToken, cm, recMorningSongs])

  useEffect(() => {
    if(!accessToken) return
    if(!ccm) return
    if(!cn) return
    if(recNoonSongs.length < 20) return
    let songs = recNoonSongs
    axios.post("http://localhost:3001/songsFeature", {
      accessToken, songs
    })
      .then(res => {
        setnSongsFeatures(res.data.features.map(features => {
          return {
            danceability: features.danceability,
            energy: features.energy,
            liveness: features.liveness,
            loudness: features.loudness
          }
        }))
        setCCN(true)
      })
  }, [accessToken, ccm, cn, recNoonSongs])

  useEffect(() => {
    if(!accessToken) return
    if(!ci) return
    if(!ccn) return
    if(recNightSongs.length < 20) return
    let songs = recNightSongs
    // console.log(songs)
    axios.post("http://localhost:3001/songsFeature", {
      accessToken, songs
    })
      .then(res => {
        setiSongsFeatures(res.data.features.map(features => {
          return {
            danceability: features.danceability,
            energy: features.energy,
            liveness: features.liveness,
            loudness: features.loudness
          }
        }))
        setCCI(true)
      })
  }, [accessToken, ci, ccn, recNightSongs])

  useEffect(() =>{
    if(mSongsFeatures.length < 20 || nSongsFeatures.length < 20 || iSongsFeatures.length < 20) return
    console.log(mSongsFeatures)
    let tempMD = 0.0;
    mSongsFeatures.map(feature => (
      tempMD = tempMD + feature.danceability
    ))
    tempMD /= 20.0;
    let tempND = 0.0;
    nSongsFeatures.map(feature => (
      tempND = tempND + feature.danceability
    ))
    tempND /= 20.0;
    let tempID = 0.0;
    iSongsFeatures.map(feature => (
      tempID = tempID + feature.danceability
    ))
    tempID /= 20.0;
    let temp = [{name: 'Morning', danceability: tempMD}, {name: 'Afternoon', danceability: tempND}, {name: 'Evening', danceability: tempID}];
    setDanceAverage(temp)
    
    
    let tempME = 0.0;
    mSongsFeatures.map(feature => (
      tempME = tempME + feature.energy
    ))
    tempME /= 20.0;
    let tempNE = 0.0;
    nSongsFeatures.map(feature => (
      tempNE = tempNE + feature.energy
    ))
    tempNE /= 20.0;
    let tempIE = 0.0;
    iSongsFeatures.map(feature => (
      tempIE = tempIE + feature.energy
    ))
    tempIE /= 20.0;
    let tempE = [{name: 'Morning', energy: tempME}, {name: 'Afternoon', energy: tempNE}, {name: 'Evening', energy: tempIE}];
    setEnergyAverage(tempE)

    
    let tempMI = 0.0
    mSongsFeatures.map(feature => (
      tempMI = tempMI + feature.liveness
    ))
    tempMI /= 20.0
    let tempNI = 0.0
    nSongsFeatures.map(feature => (
      tempNI = tempNI + feature.liveness
    ))
    tempNI /= 20.0
    let tempII = 0.0
    iSongsFeatures.map(feature => (
      tempII = tempII + feature.liveness
    ))
    tempII /= 20.0
    let tempI = [{name: 'Morning', liveness:tempMI}, {name: 'Afternoon', liveness:tempNI}, {name: 'Evening', liveness:tempII}]
    setLivenessAverage(tempI)


    let tempML = 0.0
    mSongsFeatures.map(feature => (
      tempML = tempML + feature.loudness
    ))
    tempML /= 20.0
    let tempNL = 0.0
    nSongsFeatures.map(feature => (
      tempNL = tempNL + feature.loudness
    ))
    tempNL /= 20.0
    let tempIL = 0.0
    iSongsFeatures.map(feature => (
      tempIL = tempIL + feature.loudness
    ))
    tempIL /= 20.0
    let tempL = [{name: 'Morning', loudness:tempML}, {name: 'Afternoon', loudness: tempNL}, {name: 'Evening', loudness: tempIL}]
    setLoudnessAverage(tempL)
    setAveDone(true)

  }, [mSongsFeatures, nSongsFeatures, iSongsFeatures])

  useEffect(() => {
    if(!aveDone) return
    setBarChartData1(
      danceAverage.map(figure => {
        return {
          name: figure.name,
          danceability: figure.danceability
        }
      })
    )
    setBarChartData2(
      energyAverage.map(figure => {
        return {
          name: figure.name,
          energy: figure.energy
        }
      })
    )
    setBarChartData3(
      livenessAverage.map(figure => {
        return {
          name: figure.name,
          liveness: figure.liveness
        }
      })
    )
    setBarChartData4(
      loudnessAverage.map(figure => {
        return {
          name: figure.name,
          loudness: figure.loudness
        }
      })
    )
    setSD(true)
  }, [aveDone])


  return (
    <div>
      <h1>
        Listening Habits
      </h1>
      <div>
        {
          (sd)?
          <body className='text-center'>
            <h2>danceability</h2>
            <BarChart
              width={800}
              height={500}
              data={barChartData1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="danceability" fill="#1DB954" />
            </BarChart>
            
            <h2>energy</h2>
            <BarChart
              width={800}
              height={500}
              data={barChartData2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="energy" fill="#1DB954" />
            </BarChart>

            <h2>liveness</h2>
            <BarChart
              width={800}
              height={500}
              data={barChartData3}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="liveness" fill="#1DB954" />
            </BarChart>

            <h2>loudness</h2>
            <BarChart
              width={800}
              height={500}
              data={barChartData4}
              margin={{
                top: 0,
                right: 30,
                left: 20,
                bottom: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loudness" fill="#1DB954" />
            </BarChart>
          </body>
        :
        <div>loading...</div>
        }
      </div>

    </div>
  )
}