import React from 'react'
import { useRef } from 'react'
// import { Link } from 'react-router-dom'

// import { getAllPics } from '../lib/api'
// import { getUserId } from '../lib/auth'
import { logoDots } from '../assets/logoDots'


function Home(){
  
  const logoDotsArray = JSON.parse(logoDots)
  const logoGrid = useRef(null)
  const sloganContainer = useRef()

  const mapGrid = () =>{    
    
    const grids = []
    for (let i = 0; i < (16 * 16); i++) grids.push(i)
    return (
      <div 
        className="logo_grid"
        ref={logoGrid}
      >
        {
          grids.map(grid=>{
            return (
              <div key={grid} 
                id={grid}
                className={logoDotsArray[grid].replace('#','b')}
                style={{
                  backgroundColor: logoDotsArray[grid],
                  top: `${Math.ceil(Math.random() * 110) - 50}vh`,
                  left: `${Math.ceil(Math.random() * 110) - 50}vw`
                }}
              >
              </div>
            )
          })
        }
      </div>
    )
  }

  React.useEffect(() => {
    if (!logoGrid) return
    const cluster = setInterval(()=>{
      Math.random() < 0.4 ?
        gather(logoGrid)
        :
        disperse(logoGrid)
    }, 2000)
    const timer = setInterval(()=>{
      Math.random() < 0.4 ?
        correctColor(logoGrid)
        :
        changeColor(logoGrid)
    }, 800)
    return () => {
      clearInterval(cluster)
      clearInterval(timer)
    }
  }, [logoGrid])

  const gather = targetGrid =>{
    if (!logoGrid) return
    for (let i = 0; i < (16 * 16); i++) {
      targetGrid.current.children[i].style.top = 0
      targetGrid.current.children[i].style.left = 0
      targetGrid.current.children[i].classList.add('show_black')
    }
    sloganContainer.current.classList.add('hide')
  }

  
  const disperse = targetGrid =>{
    if (!logoGrid) return
    for (let i = 0; i < (16 * 16); i++) {
      targetGrid.current.children[i].style.top = `${Math.ceil(Math.random() * 110) - 50}vh`
      targetGrid.current.children[i].style.left = `${Math.ceil(Math.random() * 110) - 50}vw`
      targetGrid.current.children[i].classList.remove('show_black')
    }
    sloganContainer.current.classList.remove('hide')
  }
  
  const changeColor = targetGrid =>{
    if (!logoGrid) return
    const color = ['#b2eaf9','#fd74b9','#222082','transparent']  
    for (let i = 0; i < (16 * 16); i++) {
      Math.random() < 0.09 ?
        targetGrid.current.children[i].style.backgroundColor = color[Math.floor(Math.random() * color.length)]
        :
        targetGrid.current.children[i].style.backgroundColor = logoDotsArray[i]
    }
  }

  const correctColor = targetGrid =>{
    if (!logoGrid) return
    for (let i = 0; i < (16 * 16); i++) {
      targetGrid.current.children[i].style.backgroundColor = logoDotsArray[i]
    }
  }





  return (
    <div className="wrapper overflow_hidden">
      {mapGrid()}
      <div 
        ref={sloganContainer}
        className="slogan_container fade_in_slow"
      >
        draw &#43; share pixel art
      </div>  
    </div>  
  )
}

export default Home




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
