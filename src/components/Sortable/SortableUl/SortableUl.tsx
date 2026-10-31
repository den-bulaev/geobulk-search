import { MouseEvent, useRef, useState } from "react";

import { DragDropProvider } from "@dnd-kit/react";

import { SortableLi } from "../SortableLi/SortableLi";

import { IBaseItem, TSortableUlProps } from "../types";

export function SortableUl<T>(props: TSortableUlProps<T>) {
  const {
    sortableData,
    onClickItem,
    onClickCheckbox,
    onDeleteItem,
    onDragEnd,
  } = props;

  const [selectedItem, setSelectedItem] = useState<IBaseItem<T> | null>(null);
  const containerRef = useRef<HTMLUListElement | null>(null);

  const handleClickItem = (
    e: MouseEvent<HTMLLIElement>,
    chosenItem: IBaseItem<T>,
  ) => {
    e.stopPropagation();
    setSelectedItem(chosenItem);
    onClickItem(chosenItem);
  };

  return (
    <div className="list-wrapper">
      <DragDropProvider onDragEnd={onDragEnd}>
        <ul ref={containerRef} className="location-list">
          {sortableData.map((sortableItem, i) => {
            return (
              <SortableLi<T>
                index={i}
                className={`preset-list-item${selectedItem?.key === sortableItem.key ? " background-light-purple" : ""}`}
                item={sortableItem}
                containerRef={containerRef}
                onClickCheckbox={onClickCheckbox}
                onClickItem={handleClickItem}
                onDeleteItem={onDeleteItem}
                key={sortableItem.id}
              />
            );
          })}
        </ul>
      </DragDropProvider>
    </div>
  );
}
