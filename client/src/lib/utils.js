
export const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  

  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  const blankRemoved = array.filter(dot=> dot !== '')
  const orderedByFrequency = blankRemoved.map(ele=>{  
    return `${ele}_${countOccurrences(blankRemoved,ele)}`
  }).sort((a, b) => b.split('_')[1] - a.split('_')[1])  
  return [ ...new Set(orderedByFrequency.map(ele=>ele.split('_')[0]))]
}