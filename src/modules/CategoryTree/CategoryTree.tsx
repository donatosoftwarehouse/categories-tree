import { FC, useState } from 'react';
import { manageListItem, findItemById } from './utils';
import { itemProps } from './types';
import styles from './CategoryTree.module.scss';

interface Props {
  data: itemProps;
}

const CategoryTree: FC<Props> = ({ data }) => {
  const [tree, setTree] = useState<itemProps>(data);
  const [draggableItem, setDraggableItem] = useState<itemProps>();

  function handleDragStart(event: React.DragEvent<HTMLUListElement>) {
    const targetItem = event.target as HTMLDivElement;
    const { id } = targetItem.dataset;

    if (id) {
      const item = findItemById([tree], id);
      setDraggableItem(item);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLUListElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLUListElement>) {
    event.preventDefault();
    const targetItem = event.target as HTMLDivElement;
    const { id, level, parent } = targetItem.dataset;

    if (draggableItem && id && level && parent) {
      manageListItem({
        action: 'drag',
        arr: [tree],
        draggableItem,
        id,
        level: Number(level),
        parent
      });
      setTree({ ...tree });
    }
  }

  const renderDeleteButton = (id: string) => (
    <span
      className={styles['remove-btn']}
      onClick={() => {
        manageListItem({ action: 'remove', arr: tree.children, id });
        setTree({ ...tree });
      }}
    >
      &#10006;
    </span>
  );

  const renderChildren = (item: itemProps) =>
    item.children &&
    !!item.children.length && (
      <ul onDragStart={handleDragStart} onDrop={handleDrop}>
        {renderList(item.children)}
      </ul>
    );

  const renderList = (items: itemProps[]) =>
    items.map((item) => (
      <li
        key={item.id}
        draggable="true"
        data-id={item.id}
        data-level={item.level}
        data-parent={item.parent}
        className={styles['list-item']}
      >
        {item.name}
        {renderDeleteButton(item.id)}
        {renderChildren(item)}
      </li>
    ));

  return (
    <ul onDragOver={handleDragOver} onDrop={handleDrop}>
      <li>
        {tree.name}
        {tree.children && !!tree.children.length && (
          <ul onDragStart={handleDragStart} onDrop={handleDrop}>
            {renderList(tree.children)}
          </ul>
        )}
      </li>
    </ul>
  );
};

export default CategoryTree;
