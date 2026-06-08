import { CalendarIcon } from "@phosphor-icons/react/dist/ssr";

export default function EventsModulePage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
        <CalendarIcon size={40} weight="duotone" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Events Module</h1>
      <p className="text-slate-500 max-w-sm">
        End-to-end event review, publishing and management tools are coming soon.
      </p>
    </div>
  );
}
