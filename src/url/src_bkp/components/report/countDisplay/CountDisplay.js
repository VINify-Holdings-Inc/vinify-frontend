import React, { useEffect, useState } from "react";
import {
  getOpenCount,
  getOpenNonUniqueCount,
  getOpenUniqueCount,
  getClickCount,
  getClickNewCount,
  getClickUniqueCount,
  getClickNonUniqueCount,
} from "../../../core/helpers/report";

const CountDisplay = ({ engagements, snippet, name, type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (engagements && engagements.length) {
      getCount();
    }
  }, [engagements]);

  const getCount = () => {
    switch (type) {
      case "view":
        setCount(getOpenCount(engagements));
        break;
      case "uniqueOpen":
        setCount(getOpenUniqueCount(engagements));
        break;
      case "nonUniqueOpen":
        setCount(getOpenNonUniqueCount(engagements));
        break;
      case "click":
       // setCount(getClickCount(engagements));
          setCount(getClickNewCount(engagements));
        break;
      case "uniqueClick":
        setCount(getClickUniqueCount(engagements));
        break;
      case "nonUniqueClick":
        setCount(getClickNonUniqueCount(engagements));
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-light-rose border border-gray-200 px-8 py-5 h-full">
      {type === "click" && (
        <svg
          className="fill-current text-light-rose-dark h-10"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M11 9l10 7.675-4.236.71 2.659 5.422-2.44 1.193-2.675-5.474-3.308 2.863v-12.389zm0-5c-2.209 0-4 1.791-4 4 0 1.477.81 2.752 2 3.445v-1.225c-.609-.55-1-1.337-1-2.22 0-1.654 1.346-3 3-3s3 1.346 3 3c0 .246-.038.481-.094.709l.842.646c.154-.424.252-.877.252-1.355 0-2.209-1.791-4-4-4zm-2 9.65c-2.327-.826-4-3.044-4-5.65 0-3.309 2.691-6 6-6s6 2.691 6 6c0 .939-.223 1.824-.609 2.617l1.617 1.241c.631-1.145.992-2.459.992-3.858 0-4.418-3.581-8-8-8-4.418 0-8 3.582-8 8 0 3.727 2.551 6.849 6 7.738v-2.088z" />
        </svg>
      )}

      {type === "view" && (
        <svg
          className="fill-current text-light-rose-dark h-10"
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm8.413 7c-1.837 2.878-4.897 5.5-8.413 5.5-3.465 0-6.532-2.632-8.404-5.5 1.871-2.868 4.939-5.5 8.404-5.5 3.518 0 6.579 2.624 8.413 5.5zm-8.411-4c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
            fill-rule="nonzero"
          />
        </svg>
      )}

      <h3 id="value" className="text-2xl font-bold inline-block mt-1 mb-0 mr-1">
        {`${count}`}
      </h3>
      <span style={{ textAlign: "center" }}>{`${name.split(" ")[1]}`}</span>
      <h3
        id="title"
        className="text-light-rose-dark text-base mt-2"
      >{`${name}`}</h3>
    </div>
  );
};

export { CountDisplay };
