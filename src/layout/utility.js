import _ from 'lodash'

export function walkConfig(config, dim = [1, 1]) {
  const [w, h] = dim
  const {content} = config

  let dims = _(content).map('dim').sum() || 0
  let noDimCount = _(content).map('dim').filter(_.isUndefined).value().length

  if (dims > 1 || (noDimCount > 0 && dims === 1)) {
    dims = 0
    noDimCount = content.length
  }

  switch (config.type) {
  case 'row':
    return {
      ...config, w, h,
      content: content.map(c => walkConfig(c, [c.dim || (w - dims) / noDimCount, h]))
    }
  case 'column':
    return {
      ...config, w, h,
      content: content.map(c => walkConfig(c, [w, c.dim || (h - dims) / noDimCount]))
    }
  case 'item':
    return {...config, w, h}
  default:
    return {
      content: content.map(c => walkConfig(c, [c.dim || (w - dims) / noDimCount, h]))
    }
  }
}
