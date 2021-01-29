import React from 'react'
import { Link } from 'react-router-dom'

import { getAllPics } from '../lib/api'


function Home(){
  const [pics, setPics] = React.useState(null)
  const [error, setError] = React.useState(false)
  let idN = 0

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

  if (pics) console.log(pics)

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
    return pics.map(pic=>{
      return (
        <div 
          key={pic.id}
          className="index"
        >  
          <Link to={`/pics/${pic.id}/`}>
            <img src={pic.image} alt={pic.title} />
          </Link>
          <div className="index_palette">
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