import React from "react";
import Link from "next/link";

function OtherLink() {
  return (
    <div className="px-10 py-4 flex flex-col gap-2">
      <p className="font-semibold text-lg">Other links:</p>
      <Link href="https://www.canva.com/design/DAGfUoMh_FY/rzWn8y1pZrOc0OLSUkJAKw/view?utm_content=DAGfUoMh_FY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h81a75c8a9d#14">
        <p className="text-sm">A. Supplier Work Instructions</p>
      </Link>
    </div>
  );
}

export default OtherLink;
