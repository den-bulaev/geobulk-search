import { useRef, useState } from "react";

import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";

import { TrashIcon } from "../../Icons/TrashIcon";
import { TSortableLiProps } from "../types";

export function SortableLi<T>(props: TSortableLiProps<T>) {
  const {
    className,
    index,
    item,
    containerRef,
    onClickCheckbox,
    onClickItem,
    onDeleteItem,
  } = props;

  const handleRef = useRef<HTMLButtonElement | null>(null);
  const [element, setElement] = useState<Element | null>(null);
  const { isDragging } = useSortable({
    id: item.id,
    index,
    handle: handleRef,
    element,
    modifiers: [
      RestrictToElement.configure({
        element: () => containerRef?.current,
      }),
    ],
  });

  return (
    <li
      ref={setElement}
      className={`list-item ${className}`}
      key={item.id}
      onClick={(e) => onClickItem(e, item)}
      data-shadow={isDragging || undefined}
    >
      <div className="preset">
        <input
          type="checkbox"
          checked={item.isChecked}
          onClick={(e) => onClickCheckbox(e, item.id)}
        ></input>
        <span className="checkbox"></span>
        <span className="preset-name">{item.key}</span>
      </div>

      <div className="actions-block">
        <button
          ref={handleRef}
          className="delete-preset"
          onClick={(e) => onDeleteItem(e, item.key)}
        >
          <TrashIcon />
        </button>
        <button ref={handleRef} className="handle" />
      </div>
    </li>
  );
}
