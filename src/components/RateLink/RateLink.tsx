import { useEffect, useState } from "react";
import { BackgroundActions, getDate } from "../../utils";

export function RateLink() {
  const [isRated, setIsRated] = useState(false);
  const [daysOpened, setDaysOpened] = useState<string[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: BackgroundActions.getIsRated,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          setIsRated(response.data);
        }
      },
    );

    const date = new Date();

    chrome.runtime.sendMessage(
      {
        action: BackgroundActions.setDaysOpened,
        state: getDate(date),
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          setDaysOpened(response.data);
        }
      },
    );
  }, []);

  const handleClickLink = () => {
    chrome.runtime.sendMessage(
      {
        action: BackgroundActions.setIsRated,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        }
      },
    );
  };

  return isRated || daysOpened.length < 5 ? (
    <></>
  ) : (
    <a
      className="rate-extension"
      href="https://chromewebstore.google.com/detail/gfkienbdjifbdhablmidgmmgkmdmfbjd/reviews"
      target="_blank"
      onClick={handleClickLink}
    >
      <span>⭐</span> Enjoying GeoBulk? Leave a review <span>❤️</span>
    </a>
  );
}
