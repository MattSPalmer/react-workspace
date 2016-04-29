import {createStore} from 'redux'

import reducer from 'react-workspace/reducers'

export default function makeStore() {
  return createStore(reducer)
}
