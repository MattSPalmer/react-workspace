/* @flow */
import {combineReducers} from 'redux'
import {pipe, get, has, map, omit, pull, flatten, fromPairs} from 'lodash/fp'

const ITEMS_INITIAL_STATE = {
  layoutRoot: {
    id: 'layoutRoot',
    dim: {w: 1, h: 1},
  },
  initialContent: {
    id: 'initialContent',
    type: 'item',
    component: 'default',
  }
}

const CHILDREN_INITIAL_STATE = {
  layoutRoot: ['initialContent'],
}

function items(state = ITEMS_INITIAL_STATE, action) {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    const id = get('item.id')(action)
    if (has(id, state)) return state
    return {
      [action.item.id]: {
        parent: action.parent || 'layoutRoot',
        type: 'item',
        component: 'default',
        ...action.item
      },
      ...state
    }
  }
  case 'UPDATE_LAYOUT_ITEM': {
    const layoutItem = state[action.id]
    return {
      ...state,
      [action.id]: item(layoutItem, action)
    }
  }
  case 'REMOVE_LAYOUT_ITEM': {
    return omit(action.id, state)
  }
  default:
    return state
  }
}

function item(state = {}, action) {
  switch (action.type) {
  case 'UPDATE_LAYOUT_ITEM': {
    return {...state, ...action.payload, id: state.id}
  }
  }
}

function children(state = CHILDREN_INITIAL_STATE, action) {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    const parent = action.item.parent || 'layoutRoot'
    return {
      ...state,
      [parent]: itemChildren(state[parent], action)
    }
  }
  case 'UPDATE_LAYOUT_ITEM': {
    // TODO: allow full overwriting
    const item = state[action.id]
    const currentParentId = invertChildren(state)[action.id]
    const {parent, index} = action.payload

    // if item doesn't exist or payload doesn't include one of
    // [parent, index], nothing to do here
    if (!item || (!parent & !index)) return state

    let output = {...state}

    if (parent && currentParentId !== parent) {
      output = {
        ...output,
        [parent]: itemChildren(output[parent], action),
        [currentParentId]: itemChildren(
          state[currentParentId],
          {type: 'REMOVE_LAYOUT_ITEM', id: action.id}
        )
      }
    } else {
      output = {
        ...output,
        [currentParentId]: itemChildren(state[currentParentId], action)
      }
    }
    return output
  }
  case 'REMOVE_LAYOUT_ITEM': {
    const item = state[action.id]
    if (!item) return state
    const currentParent = get(invertChildren(state)[action.id])(state)
    const output = {
      ...state,
      [item.parent]: itemChildren(currentParent, action)
    }
    return omit(action.id, output)
  }
  default:
    return state
  }
}

function itemChildren(state = [], action) {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    const {index} = action
    let output = pull(action.id, state)
    if (index) {
      return [
        ...output.slice(0, index),
        action.item.id,
        ...output.slice(index, output.length)
      ]
    } else {
      return [...output, action.item.id]
    }
  }
  case 'UPDATE_LAYOUT_ITEM': {
    const {index} = action.payload
    if (index) {
      let output = pull(action.id, state)
      return [
        ...output.slice(0, index),
        action.item.id,
        ...output.slice(index, output.length)
      ]
    } else {
      return state
    }
  }
  case 'REMOVE_LAYOUT_ITEM': {
    return pull(action.id, state)
  }
  default:
    return state
  }
}

function invertChildren(childrenMap) {
  return pipe(
    map((v, k) => v.map(i => [i, k])),
    flatten, fromPairs
  )(childrenMap)
}



export default combineReducers({
  items, children
})
