import {createStore} from 'redux'

import reducer from './layout/reducers'

export default function makeStore() {
  return createStore(reducer)
}
