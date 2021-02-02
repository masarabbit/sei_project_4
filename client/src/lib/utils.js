
export const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  

  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  const blankRemoved = array.filter(dot=> dot !== '' && dot)
  const orderedByFrequency = blankRemoved.map(ele=>{  
    return `${ele}_${countOccurrences(blankRemoved,ele)}`
  }).sort((a, b) => b.split('_')[1] - a.split('_')[1])  
  return [ ...new Set(orderedByFrequency.map(ele=>ele.split('_')[0]))]
}


export const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255)
    throw 'Invalid color component'
  return ((r << 16) | (g << 8) | b).toString(16)
}


export const dynamicSort = property => {
  let sortOrder = 1

  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }

  return function (a,b) {
    if (sortOrder === -1){
      return b[property].localeCompare(a[property])
    } else {
      return a[property].localeCompare(b[property])
    }        
  }
}