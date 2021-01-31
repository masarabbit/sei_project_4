import React from 'react'


function RandomBlocks(){

  let idN = 0
  const blocks = []
  const colors = [ 'rgb(250, 181, 227)','#b2eaf9','#b2eaf9']
  for (let i = 0; i < 10; i++){
    blocks.push(colors[Math.floor(Math.random() * colors.length)])
  }


  return blocks.map(block=>{
    idN++
    return (
      <div 
        key={idN}
        className="color_block_container"
        style={{ position: 'fixed', top: `${Math.ceil(Math.random() * 80)}%`, left: `${Math.ceil(Math.random() * 80)}%`   }}
      >
        <div 
          className="color_block" 
          style={{ backgroundColor: block }}
        >
        </div>  
      </div>  
    )
  })
}

export default RandomBlocks