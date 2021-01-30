import React from 'react'
import { Link } from 'react-router-dom'

import { getAllPics } from '../lib/api'


function Home(){
  const [pics, setPics] = React.useState(null)
  const [error, setError] = React.useState(false)

  const [ picCounter, setPicCounter ] = React.useState(0)
  let idN = 0

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

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getAllPics()
        setPics(data)
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[])

  // if (pics) console.log(pics)

  


  //! very similar to the one in createPic, so can be refactored and taken outside.
  //! in which case the id needs to be put in as argument.
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
        pics ?
          <main className="index_wrapper">
            {mapPics(pics)}
          </main>
          :
          error ?
            <p> can&#39;t find it ...</p>
            :
            <p> loading </p>
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
