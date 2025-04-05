"use client"

import { InlineIcon } from "@iconify/react";
import { Button } from "@/components/custom_ui/Button";

export function AuthorizaPayoutModal({close}:{close:() => void}) {

    return (
        <div
        onClick={close}
        className="w-screen h-screen fixed inset-0 bg-black/50 z-[50] "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="right-0 max-h-[85%] inset-0 h-fit m-auto animate-float-in border vert-scroll inset-y-0 absolute max-w-2xl w-full bg-white rounded-xl overflow-y-auto"
        >
          <div className="w-full flex flex-col items-start p-4 justify-start gap-3">
            <div className="w-full flex items-center justify-between">
              <h2>Enter Payout Detail</h2>
              <Button
                onClick={close}
                className="h-10 w-10 px-0  flex items-center justify-center self-end rounded-full bg-zinc-700"
              >
                <InlineIcon
                  icon={"mingcute:close-line"}
                  fontSize={22}
                  color="#ffffff"
                />
              </Button>
            </div>

            
            </div>
        </div>

        </div>
    )
    
}