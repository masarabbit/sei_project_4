
export const customStyles = {
  container: (provided) => ({
    ...provided,
    fontSize: 13,
    width: '100%'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(123, 135, 146)',
    textTransform: 'lowercase'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#b2eaf9' : 'black',
    borderRadius: 0,
    backgroundColor: state.isFocused ? '#b2eaf9' : '',
    ':active': {
      backgroundColor: '#b2eaf9'
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderColor: '#b2eaf9',
    borderRadius: 0,
    boxShadow: 'none',
    border: '#b2eaf9 solid 1px'
    // marginTop: -1
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'black'
  }),
  indicatorSeparator: () => null,
  valueContainer: (provided) => ({
    ...provided,
    marginLeft: -2
  }),
  control: (styles, state) => ({ 
    ...styles, 
    boxShadow: state.isFocused ? '0 0 0 2px rgb(253, 116, 185)' : '',
    backgroundColor: 'white',
    borderRadius: 0,
    borderColor: 'transparent',
    boxSizing: 'border-box',
    borderBottom: state.isFocused ? '' : '2px solid black',
    ':hover': {
      borderColor: 'transparent'
      // borderBottom: '2px solid rgb(253, 116, 185)'
    }
  }),
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: 'black',
      fontSize: 15,
      borderRadius: 0,
      padding: 2
    }
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'white'
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: 'white',
    borderRadius: 0,
    ':hover': {
      backgroundColor: 'white',
      color: 'black'
    }
  })
}