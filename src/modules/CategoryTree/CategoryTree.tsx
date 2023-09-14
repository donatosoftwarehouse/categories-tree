import { FC, useState } from 'react';
import { findItemById, removeItem, dragItem } from './utils';
import { itemProps } from './types';
import styles from './CategoryTree.module.scss';

interface Props {
  data: itemProps;
}

const CategoryTree: FC<Props> = ({ data }) => {
  const [tree, setTree] = useState<itemProps>(data);
  const [draggableItem, setDraggableItem] = useState<itemProps>();

  const handleDragStart = (event: React.DragEvent<HTMLUListElement>) => {
    const targetItem = event.target as HTMLDivElement;
    const { id } = targetItem.dataset;

    if (id) {
      const item = findItemById(tree.children, id);
      setDraggableItem(item);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLUListElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    const targetItem = event.target as HTMLDivElement;
    const { id, level, parent } = targetItem.dataset;

    console.log('drag');

    if (draggableItem && id && level && parent) {
      dragItem([tree], draggableItem, id, Number(level), parent);
      setTree({ ...tree });
    }
  };

  const renderDeleteButton = (id: string) => (
    <span
      className={styles['remove-btn']}
      onClick={() => {
        removeItem(tree.children, id);
        setTree({ ...tree });
      }}
    >
      &#10006;
    </span>
  );

  const renderChildren = (item: itemProps) =>
    item.children &&
    !!item.children.length && <ul>{renderListItems(item.children)}</ul>;

  const renderListItems = (items: itemProps[]) =>
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
    <ul className={styles['list']}>
      <li>
        <b>{tree.name}</b>
        {tree.children && !!tree.children.length && (
          <ul
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {renderListItems(tree.children)}
          </ul>
        )}
      </li>
    </ul>
  );
};

export default CategoryTree;
