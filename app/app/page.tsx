"use client";

import React, { Suspense } from "react";
import BillNoticePage from "./BillNoticePage";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BillNoticePage />
        </Suspense>
    );
}
