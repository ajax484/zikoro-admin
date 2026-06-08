import { HouseLineIcon } from "@phosphor-icons/react/dist/ssr";

export default function WorkspaceModulePage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <div className="p-4 bg-violet-50 text-violet-600 rounded-full">
        <HouseLineIcon size={40} weight="duotone" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Workspace Module</h1>
      <p className="text-slate-500 max-w-sm">
        Organisation-level configuration and workspace management tools are coming soon.
      </p>
    </div>
  );
}
