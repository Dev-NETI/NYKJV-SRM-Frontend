"use client";

import React from "react";
import LogoCanvas from "../logo/srm/Logo";

function SrmLogo() {
  return (
    <div className="flex justify-start ">
      <LogoCanvas
        height="220px"
        width="220px"
        position="absolute"
        top={-50}
        left={0}
      />
    </div>
  );
}

export default SrmLogo;
