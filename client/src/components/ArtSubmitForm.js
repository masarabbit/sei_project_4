import React from 'react'

import Select from 'react-select'
import profileIcon from '../assets/profile_icon.svg'

import { selectOptions } from './select/selectOptions.js'
import { customStyles } from './select/customStyles.js'




function ArtSubmitForm({ picInfo, setPicInfo, handleUpload }){
  const [hover, setHover] = React.useState(null)

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)
  const handleHoverSelect = () => setHover('categories')

  
  const handleFormChange = e => {
    setPicInfo({ ...picInfo, [e.target.name]: e.target.value })
  }

  const handleMultiChange = (selected, name) => {
    const value = selected ? selected.map(item=> item.value) : []
    // console.log(value)
    handleFormChange({
      target: { name, value }
    })
  }



  return (

    <form className="art_submission_menu">
        
      <div className="input_box">
        <img src={profileIcon} 
          className={`${hover === 'title' ? 'hover' : ''}`}
          alt="smiley face" />
        <input type="title" 
          name="title"
          onChange={handleFormChange}
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
          value={picInfo.title}
          placeholder="title"
          className="pinkfocus"
        />
      </div>

      <div className="input_box"
        onMouseEnter={handleHoverSelect}
        onMouseLeave={removeHover}
      >
        <img src={profileIcon} 
          className={`${hover === 'categories' ? 'hover' : ''}`}
          alt="smiley face" 
          onMouseEnter={removeHover}
        />
        <Select
          styles={customStyles}
          options={selectOptions}
          isMulti
          name='categories'
          onChange = {(selected) => handleMultiChange(selected, 'categories')} 
        />
      </div>  

      <div className="input_box">
        <img src={profileIcon} 
          className={`${hover === 'description' ? 'hover' : ''}`}
          alt="smiley face" />
        <textarea type="description" 
          name="description"
          onChange={handleFormChange}
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
          value={picInfo.description}
          placeholder="description"
          className="twenty_px_bottom_margin"
        />
      </div>  


      <div className="button_wrapper">
        <button 
          onClick={handleUpload}
          className="submit_art"
        >
        submit
        </button>  
      </div>
    </form>

  )
}

export default ArtSubmitForm