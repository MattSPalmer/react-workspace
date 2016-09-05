/* eslint-disable no-undef */
import children from '../../src/reducers/children'
import {ROOT, INITIAL_CONTENT} from '../../src/reducers/constants'
import {keys} from 'lodash/fp'

describe('children', () => {
  it('has the correct number of initial items', () => {
    const state = children(undefined, {})
    expect(keys(state).length).toBe(1)
  })

  describe('adding items', () => {
    it('adds new item under the correct parent', () => {
      let state = undefined

      const addParent = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'dad', type: 'column' }
      }

      const addChild = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', parent: 'dad', component: 'size' }
      }

      state = children(state, addParent)
      state = children(state, addChild)

      expect(state['dad'].length).toBe(1)
    })

    it('adds new item at top level when no parent is specified', () => {
      let state = undefined

      const action = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', component: 'size' }
      }

      state = children(state, action)

      expect(state[ROOT].length).toBe(2)
    })

    it('does not add items that already exist', () => {
      let state = undefined

      const first = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', component: 'size' }
      }

      const second = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', component: 'size' }
      }

      state = children(state, first)
      state = children(state, second)

      expect(state[ROOT]).toEqual([INITIAL_CONTENT, 'foo'])
    })
  })

  describe('updating items', () => {
    it('does nothing when the parent doesn\'t change', () => {
      let preUpdateState
      let state

      const addParent = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'dad', type: 'column' }
      }

      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', component: 'size' }
      }

      const updateItem = {
        type: 'UPDATE_LAYOUT_ITEM',
        id: 'foo',
        payload: { component: 'time' }
      }

      preUpdateState = children(state, addParent)
      preUpdateState = children(preUpdateState, addItem)
      state = children(preUpdateState, updateItem)

      expect(state).toEqual(preUpdateState)
    })

    it('updates parents correctly', () => {
      let state

      const addParent = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'dad', type: 'column' }
      }

      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: { id: 'foo', component: 'size' }
      }

      const updateItem = {
        type: 'UPDATE_LAYOUT_ITEM',
        id: 'foo',
        payload: { parent: 'dad', component: 'time' }
      }

      state = children(state, addParent)
      state = children(state, addItem)
      state = children(state, updateItem)

      expect(state[ROOT]).toEqual([INITIAL_CONTENT, 'dad'])
      expect(state['dad']).toEqual(['foo'])
    })
  })

  describe('removing items', () => {
    it('should remove items from the state', () => {
      let state

      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo'},
      }

      const removeItem = {
        type: 'REMOVE_LAYOUT_ITEM',
        id: 'foo',
      }

      state = children(state, addItem)
      expect(state[ROOT]).toEqual([INITIAL_CONTENT, 'foo'])

      state = children(state, removeItem)
      expect(state[ROOT]).toEqual([INITIAL_CONTENT])
    })

    it('should have no effect when item doesn\'t exist', () => {
      let state

      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo'},
      }

      const removeItem = {
        type: 'REMOVE_LAYOUT_ITEM',
        id: 'bar',
      }

      let initialState = children(initialState, addItem)
      state = children(initialState, removeItem)


      expect(state).toEqual(initialState)
    })
  })

  describe('splitting items', () => {
    describe('perpendicular to parent', () => {
      it('converts to a column with ROOT as parent', () => {
        let state

        const addItem = {
          type: 'ADD_LAYOUT_ITEM',
          item: {id: 'foo'},
        }

        const splitItem = {
          type: 'SPLIT_LAYOUT_ITEM',
          id: 'foo',
          direction: 'perpendicular',
          newParentId: 'fooParent',
          newItem: {id: 'bar'}
        }

        state = children(state, addItem)
        state = children(state, splitItem)

        expect(state[ROOT]).toEqual([INITIAL_CONTENT, 'fooParent'])
        expect(state['fooParent']).toEqual(['foo', 'bar'])
      })

      it('updates parent data correctly with a perpendicular split', () => {
        let state

        const addParent = {
          type: 'ADD_LAYOUT_ITEM',
          item: {id: 'dad', type: 'row'},
        }

        const addItem = {
          type: 'ADD_LAYOUT_ITEM',
          item: {id: 'foo', parent: 'dad'},
        }

        const splitItem = {
          type: 'SPLIT_LAYOUT_ITEM',
          direction: 'perpendicular',
          id: 'foo',
          newParentId: 'uncle',
          newItem: {id: 'cousin'}
        }

        state = children(state, addParent)
        state = children(state, addItem)
        state = children(state, splitItem)

        expect(state['dad']).toEqual(['uncle'])
        expect(state['uncle']).toEqual(['foo', 'cousin'])
      })

    })

    describe('parallel to parent', () => {
      it('adds a new adjacent item', () => {
        const addParent = {
          type: 'ADD_LAYOUT_ITEM',
          item: {id: 'dad', type: 'column'},
        }

        const addItem = {
          type: 'ADD_LAYOUT_ITEM',
          item: {id: 'foo', parent: 'dad'},
        }

        const splitItem = {
          type: 'SPLIT_LAYOUT_ITEM',
          direction: 'parallel',
          id: 'foo',
          newItem: {id: 'cousin'}
        }

        let state = children(state, addParent)
        state = children(state, addItem)
        state = children(state, splitItem)

        expect(state['dad']).toEqual(['foo', 'cousin'])
      })

    })
  })
})