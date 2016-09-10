import * as u from '../src/utility'

describe('tree manipulation', () => {
  const inputWithChildren = {
    id: 'root',
    dim: {w: 1, h: 1},
    content: [
      {
        id: 'row1',
        type: 'row',
        content: [
          {id: 'row1child1'},
          {id: 'row1child2'},
          {id: 'row1child3'},
        ],
      },
      {
        id: 'column1',
        type: 'column',
        content: [
          {id: 'column1child1'},
          {id: 'column1child2'},
          {id: 'column1child3'},
        ],
      },
    ],
  }
  describe('findDimensions', () => {
    it('finds the dimensions of a basic tree', () => {
      const output = u.findDimensions(inputWithChildren)
      expect(output).toMatchSnapshot()
    })

    it('correctly calculates width or height based on parent', () => {
      const output = u.findDimensions(inputWithChildren)
      expect(output).toMatchSnapshot()
    })
  })

  it('adds the index', () => {
    const output = u.transformAddIndex(inputWithChildren)
    expect(output).toMatchSnapshot()
  })

  it('adds aspect ratios', () => {
    let output = u.findDimensions(inputWithChildren)
    output = u.findAspectRatios(output)

    expect(output).toMatchSnapshot()
  })
})
