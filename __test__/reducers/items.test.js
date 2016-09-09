/* eslint-disable no-undef */
import {keys} from 'lodash/fp'
import items from '../../src/reducers/items'
import {ROOT} from '../../src/reducers/constants'

describe('items', () => {
  it('has the correct number of initial items', () => {
    const state = items(undefined, {})
    expect(keys(state).length).toBe(2)
  })

  describe('adding items', () => {
    it('respects item default values', () => {
      let state = items(undefined, {})

      const action = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo'},
      }

      state = items(state, action)

      expect(keys(state).length).toBe(3)

      const item = state.foo
      expect(item.id).toBe('foo')
      expect(item.parent).toBe(ROOT)
      expect(item.component).toBe('default')
    })

    it('overrides item default values properly', () => {
      let state = items(undefined, {})

      const action = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo', component: 'size'},
      }

      state = items(state, action)

      const item = state.foo
      expect(item.component).toBe('size')
    })

    it('does not overwrite existing items', () => {
      let state = items(undefined, {})

      const action = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo'},
      }

      const newAction = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo', component: 'size'},
      }

      state = items(state, action)

      state = items(state, newAction)

      const item = state.foo
      expect(item.component).toBe('default')
    })
  })

  describe('updating items', () => {
    it('updates item attributes', () => {
      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo', component: 'size'},
      }

      const updateItem = {
        type: 'UPDATE_LAYOUT_ITEM',
        id: 'foo',
        payload: {component: 'time'},
      }

      let state = items(state, addItem)
      state = items(state, updateItem)

      const item = state.foo

      expect(item.component).toBe('time')
    })

    it('does not add new items when id does not match existing item', () => {
      const updateAction = {
        type: 'UPDATE_LAYOUT_ITEM',
        id: 'foo',
        payload: {component: 'size'},
      }

      const state = items(state, updateAction)

      const item = state.foo

      expect(item).toBe(undefined)
    })

    it('does not change an existing item\'s id', () => {
      const action = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo', component: 'size'},
      }

      const updateAction = {
        type: 'UPDATE_LAYOUT_ITEM',
        id: 'foo',
        payload: {id: 'bar', component: 'time'},
      }

      let state = items(state, action)
      state = items(state, updateAction)

      const item = state.foo

      expect(item.id).toBe('foo')
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

      state = items(state, addItem)
      expect(keys(state).length).toBe(3)

      state = items(state, removeItem)
      expect(keys(state).length).toBe(2)
    })

    it('should have no effect when item doesn\'t exist', () => {
      const addItem = {
        type: 'ADD_LAYOUT_ITEM',
        item: {id: 'foo'},
      }

      const removeItem = {
        type: 'REMOVE_LAYOUT_ITEM',
        id: 'bar',
      }

      const initialState = items(initialState, addItem)
      const state = items(initialState, removeItem)


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

        state = items(state, addItem)
        state = items(state, splitItem)

        expect(state.fooParent).toEqual({
          id: 'fooParent',
          type: 'column',
          parent: ROOT,
        })

        expect(state.foo.parent).toEqual('fooParent')
        expect(state.bar.parent).toEqual('fooParent')
      })

      it('converts to a column with row as parent', () => {
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

        state = items(state, addParent)
        state = items(state, addItem)
        state = items(state, splitItem)

        expect(state.uncle.type).toBe('column')

        expect(state.foo.parent).toBe('uncle')
        expect(state.cousin.parent).toBe('uncle')
      })

      it('converts to a row with column as parent', () => {
        let state

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
          direction: 'perpendicular',
          id: 'foo',
          newParentId: 'uncle',
          newItem: {id: 'cousin'}
        }

        state = items(state, addParent)
        state = items(state, addItem)
        state = items(state, splitItem)

        expect(state.uncle.type).toBe('row')

        expect(state.foo.parent).toBe('uncle')
        expect(state.cousin.parent).toBe('uncle')
      })
    })

    describe('parallel to parent', () => {
      it('adds a new adjacent item', () => {
        let state

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

        state = items(state, addParent)
        state = items(state, addItem)
        state = items(state, splitItem)

        expect(state.dad.type).toBe('column')

        expect(state.foo.parent).toBe('dad')
        expect(state.cousin.parent).toBe('dad')
      })
    })
  })
})
