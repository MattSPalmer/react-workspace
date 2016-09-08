/* @flow */
import _, {pipe, omit, pull} from 'lodash/fp'

import {getParentId} from '../selectors'
import {ROOT, INITIAL_CONTENT} from './constants'

const CHILDREN_INITIAL_STATE = {
  [ROOT]: [INITIAL_CONTENT],
}

type ItemChildren = string[]
type ItemChildReducer = Reducer<ItemChildren>

type Children = {[key: string]: ItemChildren}
type ChildReducer = Reducer<Children>
type ChildTest = Test<Children>


const existsAsChild = (id: string): ChildTest => pipe(_.values, _.flatten, _.includes(id))

const addItemToChildren: ChildReducer = (state, action) => {
  const {item} = action
  if (existsAsChild(item.id)(state)) return state
  const parent = item.parent || ROOT
  return {
    ...state,
    [parent]: itemChildren(state[parent], action)
  }
}

const updateItemInChildren: ChildReducer = (state, action) => {
  // TODO: allow full overwriting
  const {id, payload: {parent, index}} = action

  // if item doesn't exist, nothing to do here
  const currentParent = getParentId(id, state)
  if (parent && currentParent !== parent) {
    // parent has changed
    return {
      ...state,
      [parent]: itemChildren(state[parent], action),
      [currentParent]: itemChildren(
        state[currentParent],
        {type: 'REMOVE_LAYOUT_ITEM', id}
      )
    }
  } else if (index) {
    // since parent has not changed, the index must have changed
    return {
      ...state,
      [currentParent]: itemChildren(state[currentParent], action)
    }
  }
  return state
}

const removeItemFromChildren: ChildReducer = (state, action) => {
  const parent = getParentId(action.id, state)
  let output = omit(action.id, state)
  if (parent) {
    output = {
      ...output,
      [parent]: itemChildren(output[parent], action)
    }
  }
  return output
}

const splitPerpendicular: ChildReducer = (state, action) => {
  const {id, newParentId, newItem} = action
  const newParent = {id: newParentId, parent: getParentId(id, state)}

  let resultState = addItemToChildren(state, {type: 'ADD_LAYOUT_ITEM', item: newParent})

  resultState = updateItemInChildren(resultState, {
    type: 'UPDATE_LAYOUT_ITEM',
    id,
    payload: {parent: newParentId},
  })

  resultState = addItemToChildren(resultState, {
    type: 'ADD_LAYOUT_ITEM',
    item: {...newItem, parent: newParentId},
  })

  return resultState
}

const splitParallel: ChildReducer = (state, action) => {
  const {id, newItem} = action
  return addItemToChildren(state, {
    type: 'ADD_LAYOUT_ITEM',
    item: {...newItem, parent: getParentId(id, state)},
  })
}

const children: ChildReducer = (state = CHILDREN_INITIAL_STATE, action) => {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    return addItemToChildren(state, action)
  }
  case 'UPDATE_LAYOUT_ITEM': {
    return updateItemInChildren(state, action)
  }
  case 'REMOVE_LAYOUT_ITEM': {
    return removeItemFromChildren(state, action)
  }
  case 'SPLIT_LAYOUT_ITEM': {
    const {direction} = action
    if (direction === 'perpendicular') {
      return splitPerpendicular(state, action)
    } else if (direction === 'parallel') {
      return splitParallel(state, action)
    }
    return state
  }
  default:
    return state
  }
}

const setIndex = (x: any, xs: any[], idx: number): any[] => {
  const p: any[] = pull(x, xs)
  return [...p.slice(0, idx), x, ...p.slice(idx, p.length)]
}

const setItemChildIndex = (state: ItemChildren, id: string, index: number): ItemChildren => {
  if (index) {
    return setIndex(id, state, index)
  }
  return [...pull(id, state), id]
}

export const itemChildren: ItemChildReducer = (state = [], action) => {
  switch (action.type) {
  case 'ADD_LAYOUT_ITEM': {
    const {index, item: {id}} = action
    return setItemChildIndex(state, id, index)
  }
  case 'UPDATE_LAYOUT_ITEM': {
    const {id, payload: {index}} = action
    return setItemChildIndex(state, id, index)
  }
  case 'REMOVE_LAYOUT_ITEM': {
    return pull(action.id, state)
  }
  default:
    return state
  }
}

export default children
