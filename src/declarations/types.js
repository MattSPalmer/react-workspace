/* eslint-disable */

type Test<X> = (x: X) => boolean

type Action = {[key: string]: any}
type Reducer<S> = (state: S, action: Action) => S
