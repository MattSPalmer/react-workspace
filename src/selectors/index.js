import _, {pipe, get, map, flattenDepth} from 'lodash/fp'
import {createSelector, createStructuredSelector} from 'reselect'
import {walkConfig} from '../utility'

const invertChildren = childrenMap => pipe(
  _.toPairs,
  map(([k, v]) => v.map(i => [i, k])),
  flattenDepth(1), _.fromPairs
)(childrenMap)

export const getParentId = (id, state) => pipe(invertChildren, get(id))(state)
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
