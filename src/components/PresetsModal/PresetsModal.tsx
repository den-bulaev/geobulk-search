import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "react-tooltip";
import { move } from "@dnd-kit/helpers";
import { DragEndEvent } from "@dnd-kit/react";

import { BaseModal } from "../BaseModal/BaseModal";
import { SortableUl } from "../Sortable/SortableUl/SortableUl";

import { IPreset, TPresetsModalProps } from "./utils";
import { BackgroundActions, getSearchURL, ITile } from "../../utils";
import { IBaseItem } from "../Sortable/types";

export function PresetsModal(props: TPresetsModalProps) {
  const { tiles, searchQuery, applyPresets, handleClickSearch } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presets, setPresets] = useState<IPreset[]>([]);
  const [errorKey, setErrorKey] = useState("");

  const presetNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { action: BackgroundActions.getPresets },
      (response: { data: IPreset[] }) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          if (response.data?.length) {
            setPresets(response.data);
          }
        }
      },
    );

    setErrorKey("");
  }, []);

  useEffect(() => {
    if (presetNameRef.current && isModalOpen) {
      presetNameRef.current.focus();
    }
  }, [isModalOpen]);

  const tipText = useMemo(() => {
    return `${presets.length} ${presets.length === 1 ? chrome.i18n.getMessage("presetsTipCounter") : chrome.i18n.getMessage("presetsTipCounterMultiple")} ${errorKey ? `| ${chrome.i18n.getMessage(errorKey)}` : ""}`;
  }, [presets, errorKey]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!presetNameRef.current?.value || !tiles.length) {
      return;
    }

    const presetName = presetNameRef.current.value.trim();

    if (presetName) {
      const newPreset: IPreset = {
        id: uuidv4(),
        key: presetName,
        params: tiles,
        isChecked: true,
      };

      chrome.runtime.sendMessage(
        {
          action: BackgroundActions.addPreset,
          state: newPreset,
        },
        (response) => {
          if (!response.success) {
            setErrorKey(response.message);
          } else {
            setPresets((prev) => {
              return [newPreset, ...prev];
            });
          }
        },
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorKey("");
  };

  const onClickItem = (chosenPreset: IBaseItem<ITile>) => {
    applyPresets(chosenPreset.params);
  };

  const bulkUpload = () => {
    if (!searchQuery.current?.value) {
      handleClickSearch();
      return;
    }

    presets.forEach((preset) => {
      if (preset.isChecked) {
        chrome.tabs.create({
          url: getSearchURL(searchQuery.current!.value, preset.params),
        });
      }
    });
  };

  const deletePreset = (
    e: MouseEvent<HTMLButtonElement>,
    presetName: string,
  ) => {
    e.stopPropagation();

    chrome.runtime.sendMessage(
      {
        action: BackgroundActions.deletePreset,
        state: { key: presetName },
      },
      (response: { data: IPreset[]; success: boolean; message?: string }) => {
        if (!response.success && response.message) {
          console.error(chrome.i18n.getMessage("presetsTipCounterMultiple"));
        } else {
          if (response.data) {
            setPresets(response.data);
            setErrorKey("");
          }
        }
      },
    );
  };

  const handleClickCheckbox = (e: MouseEvent, presetID: string) => {
    e.stopPropagation();

    chrome.runtime.sendMessage(
      {
        action: BackgroundActions.updatePresets,
        state: presetID,
      },
      (response: { data: IPreset[] }) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          if (response.data?.length) {
            setPresets(response.data);
          }
        }
      },
    );
  };

  const onDragEnd = (e: DragEndEvent) => {
    setPresets((prev) => {
      const sortedPresets = move(prev, e);

      chrome.runtime.sendMessage(
        {
          action: BackgroundActions.saveSortedPresets,
          state: sortedPresets,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
          }
        },
      );

      return sortedPresets;
    });
  };

  return (
    <>
      <div>
        <button
          className="btn background-orange"
          onClick={() => setIsModalOpen(true)}
          data-tooltip-id="preset-btn-tooltip"
          onAuxClick={(e) => {
            if (e.button === 1 && presets.length) {
              bulkUpload();
            }
          }}
        >
          {chrome.i18n.getMessage("presetsBtn")}
        </button>

        <Tooltip
          id="preset-btn-tooltip"
          place="top"
          render={() => {
            const i18Key = presets.length
              ? "presetsTooltipBulk"
              : "createPresetsTooltip";

            return <p>{chrome.i18n.getMessage(i18Key)}</p>;
          }}
        />
      </div>

      {isModalOpen && (
        <BaseModal
          title={chrome.i18n.getMessage("presetsTitle")}
          tooltipTexts={[
            chrome.i18n.getMessage("presetsTooltip"),
            chrome.i18n.getMessage("useCheckboxesTooltip"),
          ]}
          handleClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit} className="search-form">
            <input
              ref={presetNameRef}
              className="input-prime"
              type="text"
              name="addPreset"
              placeholder={chrome.i18n.getMessage("presetsPlaceholder")}
              onChange={() => setErrorKey("")}
              {...{ spellCheck: "false" }}
            />
            <button type="submit">
              {chrome.i18n.getMessage("addPresetBtn")}
            </button>
          </form>

          <aside className="tip-left">
            <p className="useful-tip">{tipText}</p>
          </aside>

          <SortableUl
            sortableData={presets}
            onClickItem={onClickItem}
            onClickCheckbox={handleClickCheckbox}
            onDeleteItem={deletePreset}
            onDragEnd={onDragEnd}
          />
        </BaseModal>
      )}
    </>
  );
}
