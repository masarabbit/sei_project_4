import React from 'react'

function PaginationLinks({ page, pics, filterPics, prevPage, nextPage, goToPage, noOfPicsToDisplay }){
  

  function mapPageLinks(maxvalue){
    const pages = []
    for (let i = 1; i <= maxvalue; i++ ){
      switch (i) {
        case 1: pages.push(i)
          break
        case Number(page): pages.push(i)
          break    
        case (Number(page) - 1): 
          pages.push(i)
          break
        case (Number(page) + 1): 
          pages.push(i)
          break  
        case maxvalue - 1: 
          pages.push('...+')
          break  
        case maxvalue: pages.push(i)
          break
        default: pages.push('...')
      }
    } 
    // console.log('pages',pages)
    const buttonsToDisplay =  [...new Set(pages)]
    // console.log(buttonsToDisplay)
    return buttonsToDisplay.map(eachPage=>{
      return (
        <button className={`${eachPage === Number(page) ? 'current' : ''} ${eachPage[0] === '.' ? 'null' : ''}`} key={`page${eachPage}` } alt="button" onClick={()=>{
          goToPage(eachPage)
        }}>{eachPage === '...+' ? '...' : eachPage}</button>
      )
    })
  }


  return (
    <div className="pagination_wrapper">
      <div className="pagination_inner_wrapper">
        {
          Number(page) !== 1 &&
      <button onClick={prevPage}>
        &#60;
      </button>
        }
        { 
          mapPageLinks(Math.ceil(filterPics(pics).length / noOfPicsToDisplay))
        
        }
        {
          Number(page) !== Math.ceil(filterPics(pics).length / noOfPicsToDisplay) &&
        <button onClick={nextPage}>   
          &#62;
        </button>
        }
      </div>
    </div>
  )
}

export default PaginationLinks