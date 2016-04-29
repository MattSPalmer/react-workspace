import {createSelector, createStructuredSelector} from 'reselect'
import {walkConfig} from '../utility'

const main = ({items, children}) => {
  function mapper(id) {
    const item = items[id]
    if (children[id]) {
      return {...item, content: children[id].map(mapper)}
    } else {
      return item
    }
  }
  return mapper('layoutRoot')
}

export const config = createSelector(main, walkConfig)
export default createStructuredSelector({config})
