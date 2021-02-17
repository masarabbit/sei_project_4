import React from 'react'

import Select from 'react-select'
import titleIcon from '../assets/title_icon.svg'
import categoryIcon from '../assets/category_icon.svg'
import descriptionIcon from '../assets/description_icon.svg'

import { selectOptions, selectOptionsArray } from './select/selectOptions.js'
import { customStyles } from './select/customStyles.js'




function ArtSubmitForm({ formdata, handleChange, handleUpload, errors }){
  const [hover, setHover] = React.useState(null)

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)
  const handleHoverSelect = () => setHover('categories')

  const handleMultiChange = (selected, name) => {
    const value = selected ? selected.map(item=> item.value) : []
    handleChange({
      target: { name, value }
    })
  }


  return (

    <form className="art_submission_menu"
      // ref={submissionForm}
    > 
      { errors.dots && 
          <div className="error center"><p>{errors.dots}</p></div>
      }
        
      <div className="input_box">
        <img src={titleIcon} 
          className={`${hover === 'title' ? 'hover' : ''}`}
          alt="title" />
        <input type="title" 
          name="title"
          onChange={handleChange}
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
          value={formdata.title}
          placeholder="title"
          className="pinkfocus"
        />
      </div>
      { errors.title && 
          <div className="error sign_up"><p>{errors.title}</p></div>
      }

      <div className="input_box"
        onMouseEnter={handleHoverSelect}
        onMouseLeave={removeHover}
      >
        <img src={categoryIcon} 
          className={`${hover === 'categories' ? 'hover' : ''}`}
          alt="category" 
          onMouseEnter={removeHover}
        />
        <Select
          styles={customStyles}
          options={selectOptions}
          isMulti
          name='categories'
          onChange = {(selected) => handleMultiChange(selected, 'categories')} 
          value = {formdata.categories.map(ele=>{ 
            if (!ele.id) {
              return { value: ele, label: selectOptionsArray[ele - 1] }
            }
            return { value: ele.id, label: selectOptionsArray[ele.id - 1] }
          })}
        />
      </div>  
      { errors.categories && 
          <div className="error sign_up"><p>{errors.categories}</p></div>
      }

      <div className="input_box">
        <img src={descriptionIcon} 
          className={`${hover === 'description' ? 'hover' : ''}`}
          alt="description" />
        <textarea type="description" 
          name="description"
          onChange={handleChange}
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
          value={formdata.description}
          placeholder="description"
          className="twenty_px_bottom_margin"
        />
      </div>  
      { errors.description && 
          <div className="error sign_up margin_adjusted_twenty"><p>{errors.description}</p></div>
      }

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