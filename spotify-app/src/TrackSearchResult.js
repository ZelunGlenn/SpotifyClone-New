import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';

export default function TrackSearchResult({track, chooseTrack}) {
  function handlePlay() {
    chooseTrack(track)
  }

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const backgroundColor = hovered ? '#1DB954' : 'initial';
  const color = hovered ? '#fff' : 'initial';

  return (
      <div 
        className='d-flex m-2 align-items-center'
        onClick = {handlePlay}
        style = {
        {
          backgroundColor: backgroundColor,
          fontSize: '21px',
          color: color,
          padding: '10px',
          cursor: "pointer",
          transition: 'background-color 0.3s',
          fontWeight: 'bold',
        }
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src = {track.albumUrl} style = {{height: '64px', width:'64px'}} />
        <div className='ml-3'
          style = {
            {
              paddingLeft:'20px',
            }
          }
        >
          {track.title} 
          <div  style={
            {
              fontSize: '10px',
            }
          }>
          {track.artist}  
          </div> 
        </div>
      </div>
  )
}