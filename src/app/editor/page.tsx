import { PlateEditor } from "@/components/editor/plate-editor";

export default function Page() {
  return (
    <div className="mx-auto mt-8 h-screen w-xl" data-registry="plate">
      <PlateEditor />
    </div>
  );
}
