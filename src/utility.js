/* @flow */
/* eslint-disable no-console */
import _ from 'lodash'
import {pipe, map, reject, sum, multiply, isUndefined} from 'lodash/fp'

type Props = { [key: string]: any }
type Dim = { w: number, h: number }

type Tree = {
  content: Array<Tree>,
  parent: ?Tree,
  relativeScale: ?number,
  innerProps: ?Props,
  dim: Dim,
  type: string,
}

const recursiveTransform = transform => {
  function recursing(c, index) {
    if (!c.content) return transform(c, index)
    return transform({...c, content: c.content.map(recursing)}, index)
  }
  return recursing
}

const orientationFromType = type => {
  switch (type) {
  case undefined:
  case 'row':
    return 'w'
  case 'column':
    return 'h'
  default:
    throw TypeError
  }
}

function getDimensions(node: Tree) {
  if (!node.parent) {
    return {w: 1, h: 1}
  }
  const {parent, relativeScale} = node
  const {content, dim, type} = parent
  const orientation = orientationFromType(type)
  const parentDim = dim[orientation]

  let dims, noDimCount
  if (content) {
    const scales = pipe(map('relativeScale'), reject(isUndefined))
    dims = pipe(scales, sum, multiply(parentDim))(content)
    noDimCount = content.length - scales(content).length

    if (!dims || dims > 1 || (noDimCount > 0 && dims === 1)) {
      dims = 0
      noDimCount = content.length
    }
  } else {
    dims = 0
    noDimCount = content.length
  }

  let theDim = relativeScale ? relativeScale * parentDim : (parentDim - dims) / noDimCount

  switch (orientation) {
  case undefined:
  case 'w':
    return {...dim, w: theDim}
  case 'h':
    return {...dim, h: theDim}
  default:
    throw TypeError
  }
}

export function findDimensions(tree: Tree) {
  const {content} = tree
  if (!content) return tree

  const mapper = c => findDimensions({
    ...c, dim: getDimensions({...c, parent: tree})
  })
  return {...tree, content: content.map(mapper)}
}

export function findAspectRatios(tree: Tree) {
  const transform = c => ({
    ...c, dim: {...c.dim, ratio: c.dim.w / c.dim.h},
  })
  return recursiveTransform(transform)(tree)
}

export function transformAddIndex(tree: Tree) {
  const transform = (c, index = 0) => ({...c, index})
  return recursiveTransform(transform)(tree)
}

export function transformAddParent(tree: Tree) {
  const {content} = tree
  if (!content) return tree

  const mapper = c => transformAddParent({...c, parent: _.omit(tree, ['content'])})
  return {...tree, content: content.map(mapper)}
}

export function transformAddSiblings(tree: Tree) {
  const {content} = tree
  if (!content) return tree

  return {
    ...tree,
    content: content.map(
      c => ({...transformAddSiblings(c), siblings: content.length - 1})
    )
  }
}

function logFunc(tree: Tree) {
  const scale = tree.relativeScale || 1
  const parentScale = (tree.parent && tree.parent.relativeScale) || 1
  console.log(`Relative dimension is ${scale || 1}`)
  console.log(`Computed dimension is ${(scale || 1) * parentScale}`)
  if (tree.orientation) {
    console.log(`Orientation is ${tree.orientation}`)
  }
  console.log(`Dimensions are ${tree.dim.w}W x ${tree.dim.h}H`)
}

// eslint-disable-next-line no-unused-vars
function logWalk(tree: Tree) {
  console.groupCollapsed(tree.type || 'top')
  if (tree.parent)
    logFunc(tree)
  let newTree
  if (tree.content) {
    newTree = {...tree, content: tree.content.map(logWalk)}
  } else {
    newTree = tree
  }
  console.groupEnd()
  return newTree
}

export function walkConfig(tree: Tree) {
  return pipe(
    findDimensions,
    findAspectRatios,
    transformAddIndex,
    transformAddSiblings,
    transformAddParent
  )(tree)
}
