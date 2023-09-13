import { itemProps } from './types';

type manageListItemProps = {
  action: string;
  arr: itemProps[];
  draggableItem?: itemProps;
  id: string;
  level?: number,
  parent?: string;
}

export function manageListItem({
  action,
  arr,
  draggableItem,
  id,
  level,
  parent
}: manageListItemProps) {
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    switch(action) {
      case 'remove': {
        if (obj.id === id) {
          arr.splice(i, 1);
        } else if (obj.children && obj.children.length) {
          manageListItem({ action, arr: obj.children, id });
        }
      }
      break;
      case 'drag': {
        if (level && draggableItem) {
          if (obj.level === level - 1 && draggableItem.parent === obj.id) {
            manageListItem({ action: 'remove', arr, id: draggableItem.id });
            const index = obj.children.findIndex((item) => item.id === id);
            obj.children.splice(index + 1, 0, draggableItem);
            return;
          } else if (obj.children && obj.children.length) {
            manageListItem({
              action,
              arr: obj.children,
              draggableItem,
              id,
              level,
              parent
            });
          }
        }
      }
    }
  }
}

export function findItemById(arr: itemProps[], id: string) {
  let item;

  const searchRecursively = (arr: itemProps[], id: string) => {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj.id === id) {
        item = obj;
      } else if (obj.children && obj.children.length) {
        searchRecursively(obj.children, id);
      }
    }
  };
  
  searchRecursively(arr, id);

  return item;
}
