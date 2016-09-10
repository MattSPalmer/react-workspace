/* eslint-disable */

// Generic
type KeyMap<T> = {[key: string]: T}
type Test<X> = (x: X) => boolean
type Props = KeyMap<any>

// Redux
type Action = KeyMap<any>
type Reducer<S> = (state: S, action: Action) => S

// Layout types

// Items
type Id = string

type Item = {
  id: Id,
  parent: Id,
  component: string,
  type: string,
  relativeScale: ?number,
}

type Items = KeyMap<Item>


// Children
type ItemChildren = string[]
type ItemChildReducer = Reducer<ItemChildren>

type Children = KeyMap<ItemChildren>
type ChildReducer = Reducer<Children>

// Layout tree
type Dim = { w: number, h: number }

type Tree = {
  content: Tree[],
  dim: Dim,
  type: string,
  parent: Tree,
  relativeScale: ?number,
  innerProps: ?Props,
}

type Transform = (tree: Tree, index?: number) => Tree
