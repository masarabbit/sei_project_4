import React from 'react'

export default function useForm(initialState){
  const [ formdata, setFormdata ] = React.useState(initialState)
  const [ errors, setErrors ] = React.useState(initialState)


  const handleChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }


 
  
  return {
    formdata,
    setFormdata,
    handleChange,
    errors,
    setErrors
  }
}

