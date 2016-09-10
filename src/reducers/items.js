/* @flow */
import {get, has, omit} from 'lodash/fp'

import {ROOT, INITIAL_CONTENT} from './constants'

const ITEMS_INITIAL_STATE = {
  [ROOT]: {
    id: ROOT,
    dim: {w: 1, h: 1},
  },
  [INITIAL_CONTENT]: {
    id: INITIAL_CONTENT,
    parent: ROOT,
    type: 'item',
    component: 'default',
  }
}

const addItemToItems = (state: Items, item: Object) => {
  const {id} = item
  if (has(id, state)) return state

  let newItem = {
    parent: item.parent || ROOT,
    type: 'item',
    ...item
  }

  if (!(item.type && item.type !== 'item')) {
    newItem = {component: 'default', ...newItem}
  }

  return {[id]: newItem, ...state}
}

const updateItemInItems = (state: Items, id: Id, payload: Object): Items => {
  if (!has(id, state)) return state
  const item = get(id, state)
  return {...state, [id]: {...item, ...payload, id}}
}

const splitPerpendicular = (state: Items, action: Action): Items => {
  const {id, newParentId, newItem} = action
  const item = get(id, state)

  const newParent = {
    id: newParentId,
    type: state[item.parent].type === 'column' ? 'row' : 'column',
    parent: item.parent
  }

  let resultState = addItemToItems(state, newParent)
  resultState = addItemToItems(resultState, {...newItem, parent: newParent.id})
  resultState = updateItemInItems(resultState, id, {parent: newParent.id})

  return resultState
}

const splitParallel = (state, action) => {
  const {id, newItem} = action
  const parent = get([id, 'parent'], state)
  return addItemToItems(state, {...newItem, parent})
}

function items(state: Items = ITEMS_INITIAL_STATE, action: Action) {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    return addItemToItems(state, action.item)
  }
  case 'UPDATE_LAYOUT_ITEM': {
    const {id, payload} = action
    return updateItemInItems(state, id, payload)
  }
  case 'REMOVE_LAYOUT_ITEM': {
    return omit(action.id, state)
  }
  case 'SPLIT_LAYOUT_ITEM': {
    const {direction} = action
    if (direction === 'perpendicular') {
      return splitPerpendicular(state, action)
    }
    return splitParallel(state, action)
  }
  default:
    return state
  }
}
export default items
