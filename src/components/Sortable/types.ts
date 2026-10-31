import { MouseEvent, RefObject } from "react";

import { DragEndEvent } from "@dnd-kit/react";

export interface IBaseItem<T> {
  id: string;
  key: string;
  isChecked: boolean;
  params: T[];
}

export type TSortableLiProps<T> = {
  index: number;
  className: string;
  item: IBaseItem<T>;
  containerRef: RefObject<HTMLUListElement | null>;
  onClickItem: (e: MouseEvent<HTMLLIElement>, chosenItem: IBaseItem<T>) => void;
  onClickCheckbox: (e: MouseEvent, presetID: string) => void;
  onDeleteItem: (e: MouseEvent<HTMLButtonElement>, presetName: string) => void;
};

export type TSortableUlProps<T> = {
  sortableData: IBaseItem<T>[];
  onClickItem: (item: IBaseItem<T>) => void;
  onClickCheckbox: (e: MouseEvent, itemID: string) => void;
  onDeleteItem: (e: MouseEvent<HTMLButtonElement>, presetName: string) => void;
  onDragEnd: (e: DragEndEvent) => void;
};
