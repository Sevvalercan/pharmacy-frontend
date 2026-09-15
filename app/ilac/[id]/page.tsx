import { medicines } from "@/lib/data";
import MedicineDetail from "@/components/MedicineDetail";

export function generateStaticParams() {
  return medicines.map((m) => ({ id: m.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <MedicineDetail id={params.id} />;
}
