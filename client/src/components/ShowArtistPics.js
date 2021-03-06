import React from 'react'
import { useParams, Link } from 'react-router-dom'

import FollowButton from './FollowButton'
import { getArtistPics } from '../lib/api'
import { getUserId } from '../lib/auth'

import Feed from './Feed'

function ShowArtistPics (){
  const { id } = useParams()
  const [artistData,setArtistData] = React.useState(null)
  const [error,setError] = React.useState(false)
  const [followedNow, setFollowedNow]  = React.useState(null)
  const [picCounter, setPicCounter] = React.useState(null)
  let idN = 0

  const userId = getUserId()

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getArtistPics(id)
        setArtistData(data)
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[id, followedNow])


  const mapColorPalette = pic =>{
    return JSON.parse(pic.colorPalette).map(hex=>{
      idN++
      return (
        <div 
          key={idN}
          style={{ backgroundColor: hex }}
        >
        </div>  
      )
    })
  }
  
  React.useEffect(() => {
    if (!picCounter) return
    const timer = setTimeout(()=>{
      setPicCounter(picCounter + 1)
    },80)
    return () => {
      clearTimeout(timer)
    }
  }, [picCounter])

  const mapPics = (pics, subclass) => {
    if (picCounter <= pics.length){
      setPicCounter(picCounter + 1)
    }
    return pics.filter(pic=>{
      if (pics.indexOf(pic) <= picCounter) return pic
    }).slice(0,24).map(pic=>{
      return (
        <div 
          className={`index index_float_up ${subclass}`}
          key={pic.id}
          // style={{
          //   animationDelay: `${i * 0.05}s`
          // }}
        >  
          <Link to={`/pics/${pic.id}/`}>
            <img src={pic.image} alt={pic.title} className="bop" />
          </Link>
          <div className="index_palette fade_in">
            {mapColorPalette(pic)}
          </div>  
        </div>  
      )
    })
  }



  // if (artistData) console.log('pics',artistData.followedBy)

  return (
    <>
      {
        artistData ?
          <div className="wrapper artist_profile">
            <div className="artist_info_wrapper">
              <div className="profile_image">
                <img src={artistData.profileImage} alt={artistData.username} />
              </div>

              <div className="artist_name">
                {artistData.username}
                <FollowButton 
                  followed = {
                    artistData.followedBy.filter(ele=>{
                      return ele.id === userId
                    }).length > 0 ? true : false
                  }
                  artistId = {id}
                  artistData = {artistData}
                  setFollowedNow={setFollowedNow}
                />  
              </div>  
            </div>  
            { artistData.createdPic.length !== 0 ?
              <div className="feed_title fade_in">
                art by {artistData.username}:
              </div>
              :
              null
            }

            <div className="feed_wrapper">
              {mapPics(artistData.createdPic,'')}
            </div>  
            
            <Feed 
              username={artistData.username}
              userId={artistData.id}
              mapColorPalette={mapColorPalette}
            />
          </div>     
          :
          error ?
            <div className="wrapper">
              <p>oops... error...</p>
            </div>  
            :
            <div className="wrapper">
              <div className="loading_wrapper">
                <div className="blue_box"></div>
                <div className="gray_box"></div>
              </div>  
            </div>
      }   
    </>

  )
}

export default ShowArtistPics


// const mapPics = pics => {
//   return pics.map(pic=>{
//     return (
//       <div 
//         key={pic.id}
//         className="index"
//       >  
//         <Link to={`/pics/${pic.id}/`}>
//           <img src={pic.image} alt={pic.title} />
//         </Link>
//         <div className="index_palette">
//           {mapColorPalette(pic)}
//         </div>  
//       </div>  
//     )
//   })
// }