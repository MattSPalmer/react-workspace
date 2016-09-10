export const splitItem = (id, newParentId, newItem, direction): Action => ({
  type: 'SPLIT_LAYOUT_ITEM',
  id,
  newParentId,
  newItem,
  direction: direction || 'perpendicular',
})

export const addItem = (id, item): Action => ({
  type: 'SPLIT_LAYOUT_ITEM',
  id,
  item,
})
