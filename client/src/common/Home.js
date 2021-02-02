import React from 'react'
import { Link } from 'react-router-dom'

import { getAllPics } from '../lib/api'
import { getUserId } from '../lib/auth'


function Home(){
  const [error, setError] = React.useState(false)

  const [ picCounter, setPicCounter ] = React.useState(0)
  let idN = 0

  const user = getUserId()

  // const [user, setUser] = React.useState(null)
  const [pics, setPics] = React.useState(null)
  const [filteredPics, setFilteredPics] = React.useState([])
  
  // React.useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const { data } = await getUserInfo()
  //       setUser(data)
  //     } catch (err) {
  //       console.log('error')
  //     }
  //   }
  //   getData()
  // },[])
  

  const filterPics = pics => {
    const artistCheck = pics.map(pic=>{
      return pic.artist.followedBy.filter(follower=>{
        return follower === user
      })
    })
    const result = pics.filter((_pic,i) =>{
      return artistCheck[i].length !== 0
    }) 
    return result
  }
  


  React.useEffect(() => {
    if (!user) return
    const getData = async () => {
      try {
        const { data } = await getAllPics()
        setFilteredPics(filterPics(data))
        if (filterPics(data).length === 0) setPics(data.slice(0,12))
        
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[user])


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

  const mapPics = pics => {
    if (picCounter <= pics.length){
      setTimeout(()=>{
        setPicCounter(picCounter + 1)
      },80)
    }
    return pics.filter(pic=>{
      if (pics.indexOf(pic) <= picCounter) return pic
    }).map(pic=>{
      return (
        <div 
          key={pic.id}
          className="index index_float_up"
        >  
          <Link to={`/pics/${pic.id}/`}>
            <img 
              className="fade_in"
              src={pic.image} 
              alt={pic.title} 
            />
          </Link>
          <div className="index_palette fade_in">
            {mapColorPalette(pic)}
          </div>  
        </div>  
      )
    })
  }




  return (
    <div className="wrapper">
      {
        !user ?
          <p>home</p>
          :
          null
      }


      {
        filteredPics && filteredPics.length !== 0 ?
          <main className="index_wrapper">
            {mapPics(filteredPics)}
          </main>
          :
          error ?
            <p>hmm... error...</p>
            :
            null
      }

      {
        pics ?
          <main className="index_wrapper">
            {mapPics(pics)}
          </main>
          :
          error ?
            <p>hmm... error...</p>
            :
            null

        
      } 
    </div>  
  )
}

export default Home





  


//? old one
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


// const [ indexLimit, setIndexLimit ] = React.useState(12)
// const [ scrolling, setScrolling ] = React.useState(false)

// window.addEventListener('scroll', function() {
//   if (scrolling) return
//   setScrolling(true)
//   setTimeout(()=>{
//     setScrolling(false)
//   },1000)

//   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//     console.log('you\'re at the bottom of the page')
//     // Show loading spinner and make fetch request to api
//     setIndexLimit(indexLimit + 1)
//     console.log('i', indexLimit)
//   }
// })
