import React from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'

import PaginationLinks from './PaginationLinks'
import { getAllPics } from '../lib/api'
// import { dynamicSort } from '../lib/utils'

function ShowFilteredPics(){
  const history = useHistory()
  const { category, page } = useParams()
  const [error, setError] = React.useState(false)
  const [pics, setPics] = React.useState(null)
  const [picCounter, setPicCounter] = React.useState(0)
  const [filteredPics, setFilteredPics] = React.useState([])
  let idN = 0


  const filterPics = pics => {
    if (category === 'all') return pics
    const categoryCheck = pics.map(pic=>{
      return pic.categories.filter(cat=>{
        return cat.name === category
      })
    })
    const result = pics.filter((_pic,i) =>{
      return categoryCheck[i].length !== 0
    }) 
    return result
  }

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getAllPics()
        setPics(data)
        setFilteredPics(filterPics(data).slice(firstPic,page * noOfPicsToDisplay))
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[page])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const noOfPicsToDisplay = 12
  const firstPic = (page - 1) * noOfPicsToDisplay

  function prevPage(){
    history.push(`/pics/${category}/${Number(page) - 1}`)
  }
  function nextPage(){
    history.push(`/pics/${category}/${Number(page) + 1}`)
  }

  function goToPage(pageNo){
    if (pageNo === '...' || pageNo === '...+' ) return
    history.push(`/pics/${category}/${pageNo}`)
  }

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
        filteredPics && pics ?
          <>
            <main className="index_wrapper">

              <div className="category_label">
                {category !== 'all' && `${category}/` }
              </div> 

              {mapPics(filteredPics)}

              <PaginationLinks 
                page={page} 
                pics={pics} 
                filterPics={filterPics}
                prevPage={prevPage}
                nextPage={nextPage} 
                goToPage={goToPage}
                noOfPicsToDisplay={noOfPicsToDisplay}
              />
            </main>
            
          </>
          :
          error ?
            <p> can&#39;t find it ...</p>
            :
            <p> loading... </p>
      }
    </div>  
  )
}

export default ShowFilteredPics


// <div className="pagination_wrapper">
// <div className="inner_wrapper">
//   {
//     Number(page) !== 1 &&
//   <button onClick={prevPage}>
//     &#60;
//   </button>
//   }
//   { 
//     mapPageLinks(Math.ceil(filterPics(pics).length / noOfPicsToDisplay))
    
//   }
//   {
//     Number(page) !== Math.ceil(filterPics(pics).length / noOfPicsToDisplay) &&
//     <button onClick={nextPage}>   
//       &#62;
//     </button>
//   }
// </div>
// </div> 