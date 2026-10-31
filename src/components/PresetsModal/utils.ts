import { RefObject } from "react";
import { ITile } from "../../utils";

export interface IPreset {
  id: string;
  key: string;
  params: ITile[];
  isChecked: boolean;
}

export type TPresetsModalProps = {
  tiles: ITile[];
  searchQuery: RefObject<HTMLInputElement | null>;
  applyPresets: (tiles: ITile[]) => void;
  handleClickSearch: () => void;
};