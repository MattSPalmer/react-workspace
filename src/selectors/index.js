import _, {pipe, get, map, flattenDepth} from 'lodash/fp'
import {createSelector, createStructuredSelector} from 'reselect'
import {walkConfig} from '../utility'

const invertChildren = childrenMap => pipe(
  _.toPairs,
  map(([k, v]) => v.map(i => [i, k])),
  flattenDepth(1), _.fromPairs
)(childrenMap)

export const getParentId = (id, state) => pipe(invertChildren, get(id))(state)

const pathToItem = (id, children) => {
  function recurse(result) {
    const nextParent = getParentId(_.head(result), children)
    if (nextParent) {
      return recurse([nextParent, ...result])
    }
    return result
  }
  return recurse([id])
}

export const itemPath = createSelector(
  get('children'), children => id => pathToItem(id, children)
)

export const itemDepth = createSelector(
  itemPath, fn => id => fn(id).length
)

const main = ({items, children}) => {
  function mapper(id) {
    const item = items[id]
    return children[id] ? {...item, content: children[id].map(mapper)} : item
  }
  return mapper('layoutRoot')
}

export const config = createSelector(main, walkConfig)
export default createStructuredSelector({config})
