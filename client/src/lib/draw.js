export const clickAnimation = e => {
  let clear = null  
  clearInterval(clear)
  e.target.classList.add('clicked') 
  clear = setTimeout(()=>{
    e.target.classList.remove('clicked')
  },500)
}

export const drawIntoGrid = (sourceDots, target) =>{
  sourceDots.forEach((dot, i)=>{
    target.current.children[i].style.backgroundColor = dot
  })
}

export const explode = targetGrid =>{
  for (let i = 0; i < (16 * 16); i++) {
    targetGrid.current.children[i].style.top = `${Math.ceil(Math.random() * 110) - 50}vh`
    targetGrid.current.children[i].style.left = `${Math.ceil(Math.random() * 110) - 50}vw`
    setTimeout(()=>{
      targetGrid.current.children[i].classList.add('explode')
    },100)
  }
}

export const mapFromDots = (dots, ctx) => {
  for (let i = 0; i < (16 * 16); i++){
    const x = i % 16 * 20
    const y = Math.floor(i / 16) * 20
    ctx.fillStyle = dots[i] ? dots[i] : 'transparent'
    ctx.fillRect(x, y, 20, 20)
  }
}


