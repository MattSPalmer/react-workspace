import _ from 'lodash'

const recursiveTransform = transform => {
  function recursing(c) {
    if (!c.content) return transform(c)
    return transform({...c, content: c.content.map(recursing)})
  }
  return recursing
}

export function findOrientations(tree) {
  const {content} = tree
  if (!content) return tree

  const orientation = ({type}) => {
    switch (type) {
    case undefined:
    case 'row':
      return 'w'
    case 'column':
      return 'h'
    }
  }

  const mapper = c => findOrientations({
    ...c, orientation: orientation(tree)
  })
  return {...tree, content: content.map(mapper)}
}

function getDimensions(node) {
  const {parent, orientation, relativeScale} = node
  const {content, dim} = parent
  const parentDim = dim[orientation]

  let dims, noDimCount
  if (content) {
    dims = _(content).map('relativeScale').sum() * parentDim
    noDimCount = _(content).map('relativeScale').filter(_.isUndefined).value().length

    if (!dims || (dims > 1 || (noDimCount > 0 && dims === 1))) {
      dims = 0
      noDimCount = content.length
    }
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

export function findDimensions(tree) {
  const {content} = tree
  if (!content) return tree

  const mapper = c => findDimensions({
    ...c, dim: getDimensions({...c, parent: tree})
  })
  return {...tree, content: content.map(mapper)}
}

export function findAspectRatios(tree) {
  const transform = c => ({
    ...c, dim: {...c.dim, ratio: c.dim.w / c.dim.h},
  })
  return recursiveTransform(transform)(tree)
}

export function transformAddIndex(tree) {
  const transform = (c, index = 0) => ({...c, index})
  return recursiveTransform(transform)(tree)
}

export function transformAddParent(tree) {
  const {content} = tree
  if (!content) return tree

  const mapper = c => transformAddParent({...c, parent: _.omit(tree, ['content'])})
  return {...tree, content: content.map(mapper)}
}

export function transformAddSiblings(tree) {
  const {content} = tree
  if (!content) return tree

  return {
    ...tree,
    content: content.map(
      c => ({...transformAddSiblings(c), siblings: content.length - 1})
    )
  }
}

function applyTransforms(tree, ...transforms) {
  for (let transform of transforms) {
    tree = transform(tree)
  }
  return tree
}

export function walkConfig(tree) {
  return applyTransforms(tree,
    findOrientations,
    findDimensions,
    findAspectRatios,
    transformAddIndex,
    transformAddSiblings,
    transformAddParent,
  )
}
