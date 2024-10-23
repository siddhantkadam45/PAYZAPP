import React from "react"

interface obj {
    card: React.ComponentType<any>
}
export default function Generictransferholder({card : CardComponent}: obj) {
  return (
    <div>
        <div className="p-6  pt-4 border-2 w-full rounded-2xl bg-[#ffffff]  drop-shadow-2xl shadow-slate-950 overflow-y-auto">
            <CardComponent />
        </div>
    </div>
  )
}
