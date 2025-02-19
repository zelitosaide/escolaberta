import { deleteComp } from "@/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateComp() {
  return (
    <Link
      href="/admin/comps/create"
      className="flex h-10 items-center rounded-lg bg-teal-500 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
    >
      <span className="hidden md:block">Create Component</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateComp({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/comps/${id}/edit`}
      className="rounded-md border p-2 hover:bg-slate-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteComp({ id }: { id: string }) {
  const deleteCompWithId = deleteComp.bind(null, id);

  return (
    <form action={deleteCompWithId}>
      <button className="rounded-md border p-2 hover:bg-slate-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}