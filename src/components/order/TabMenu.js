import React, { useState } from "react";
import TabMenuItem from "./TabMenuItem";

function TabMenu({ handleChangeTab }) {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <div className="flex flex-row gap-4 p-4 border-b-2">
      <TabMenuItem
        active={activeItem === 1}
        label="RFQ"
        onClick={() => {
          handleChangeTab(1);
          setActiveItem(1);
        }}
      />
      <TabMenuItem
        active={activeItem === 2}
        label="Quotation Sent!"
        onClick={() => {
          handleChangeTab(2);
          setActiveItem(2);
        }}
      />
    </div>
  );
}

export default TabMenu;
