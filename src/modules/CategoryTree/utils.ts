import { itemProps } from './types';

export function findItemById(items: itemProps[], id: string) {
  let category;
  const searchRecursively = (items: itemProps[], id: string) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.id === id) {
        return (category = item);
      } else if (item.children && item.children.length) {
        searchRecursively(item.children, id);
      }
    }
  };

  searchRecursively(items, id);

  return category;
}

export function removeItem(items: itemProps[], id: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isIdMatched = item.id === id;

    if (isIdMatched) {
      return items.splice(i, 1);
    } else if (item.children && item.children.length) {
      removeItem(item.children, id);
    }
  }
}

export function dragItem(
  items: itemProps[],
  draggableItem: itemProps,
  id: string,
  level: number,
  parent: string
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const areItemsOnSameLevel = draggableItem.level === level;
    const doesItemBelongToSameParent = draggableItem.parent === item.id;

    if (areItemsOnSameLevel && doesItemBelongToSameParent) {
      const droppableItemIndex = item.children.findIndex(
        (item) => item.id === id
      );

      removeItem(items, draggableItem.id);
      item.children.splice(droppableItemIndex, 0, draggableItem);
    } else if (item.children && item.children.length) {
      dragItem(item.children, draggableItem, id, level, parent);
    }
  }
}
