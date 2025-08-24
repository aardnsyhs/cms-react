import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type FieldOptions = {
    required?: boolean;
    max?: number;
};

type Field = {
    id: string;
    name: string;
    handle: string;
    type: string;
    order: number;
    options?: FieldOptions | null;
};

type TypeDto = { id: string; name: string; slug: string; updated_at: string };

type Props = {
    type: TypeDto;
    fields: Field[];
};

const TYPES = ['text', 'richtext', 'media', 'relation', 'json', 'repeater'];

export default function Edit() {
    const { props } = usePage<Props>();
    const [name, setName] = useState(props.type.name);
    const [slug, setSlug] = useState(props.type.slug);
    const [rows, setRows] = useState<Field[]>(props.fields ?? []);
    const draggingId = useRef<string | null>(null);

    useEffect(() => setRows(props.fields ?? []), [props.fields]);

    const saveType = () => router.put(route('admin.content-types.update', props.type.id), { name, slug });

    const onDragStart = (id: string) => (e: React.DragEvent) => {
        draggingId.current = id;
        e.dataTransfer.effectAllowed = 'move';
    };
    const onDragOver = (overId: string) => (e: React.DragEvent) => {
        e.preventDefault();
        const from = rows.findIndex((r) => r.id === draggingId.current);
        const to = rows.findIndex((r) => r.id === overId);
        if (from === -1 || to === -1 || from === to) return;
        const next = rows.slice();
        const [m] = next.splice(from, 1);
        next.splice(to, 0, m);
        setRows(next);
    };
    const onDropList = () => {
        const ids = rows.map((r) => r.id);
        router.post(route('admin.content-fields.reorder', props.type.id), { ids }, { preserveScroll: true });
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Field | null>(null);
    const [fName, setFName] = useState('');
    const [fHandle, setFHandle] = useState('');
    const [fType, setFType] = useState('text');
    const [fRequired, setFRequired] = useState(false);
    const [fMax, setFMax] = useState<number | ''>('');

    const openAdd = () => {
        setEditing(null);
        setFName('');
        setFHandle('');
        setFType('text');
        setFRequired(false);
        setFMax('');
        setDialogOpen(true);
    };
    const openEdit = (f: Field) => {
        setEditing(f);
        setFName(f.name);
        setFHandle(f.handle);
        setFType(f.type);
        setFRequired(!!f.options?.required);
        setFMax(f.options?.max ?? '');
        setDialogOpen(true);
    };
    const submitField = () => {
        const payload = {
            name: fName,
            handle: fHandle,
            type: fType,
            options: {
                required: fRequired,
                ...(fMax !== '' && !Number.isNaN(Number(fMax)) && { max: Number(fMax) }),
            },
        };
        if (fMax !== '' && !Number.isNaN(Number(fMax))) payload.options.max = Number(fMax);

        if (editing) {
            router.put(route('admin.content-fields.update', [props.type.id, editing.id]), payload, {
                onSuccess: () => setDialogOpen(false),
            });
        } else {
            router.post(route('admin.content-fields.store', props.type.id), payload, {
                onSuccess: () => setDialogOpen(false),
            });
        }
    };
    const delField = (f: Field) => {
        if (!confirm(`Delete field "${f.name}"?`)) return;
        router.delete(route('admin.content-fields.destroy', [props.type.id, f.id]), { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Edit: ${props.type.name}`} />
            <div className="mx-auto max-w-5xl space-y-8 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Edit Content Type</h1>
                        <p className="text-sm text-gray-500">ID #{props.type.id}</p>
                    </div>
                    <Link href={route('admin.content-types.index')} className="text-sm underline">
                        Back
                    </Link>
                </div>
                <div className="space-y-4 rounded-2xl border p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input className="w-full rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Slug</label>
                            <input
                                className="w-full rounded-xl border px-3 py-2"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                            />
                        </div>
                    </div>
                    <button onClick={saveType} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                        Save Type
                    </button>
                </div>
                <div className="rounded-2xl border">
                    <div className="flex items-center justify-between p-5">
                        <h2 className="text-lg font-semibold">Fields</h2>
                        <button onClick={openAdd} className="rounded-xl border px-3 py-2 hover:bg-gray-50">
                            + Add Field
                        </button>
                    </div>
                    <div className="px-5 pb-5">
                        <div onDrop={onDropList} onDragOver={(e) => e.preventDefault()} className="rounded-xl border bg-gray-50/50">
                            {rows.length === 0 && <div className="p-6 text-center text-gray-500">No fields yet.</div>}
                            {rows.map((f) => (
                                <div
                                    key={f.id}
                                    draggable
                                    onDragStart={onDragStart(f.id)}
                                    onDragOver={onDragOver(f.id)}
                                    className="flex items-center justify-between border-b bg-white px-4 py-3 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="cursor-grab">≡</span>
                                        <div>
                                            <div className="font-medium">
                                                {f.name} <span className="text-gray-400">({f.handle})</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{f.type}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(f)} className="rounded-lg border px-3 py-1 hover:bg-gray-50">
                                            Edit
                                        </button>
                                        <button onClick={() => delField(f)} className="rounded-lg border px-3 py-1 hover:bg-red-50">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {rows.length > 0 && (
                            <div className="flex justify-end pt-3">
                                <button onClick={onDropList} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                                    Save Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {dialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                        <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{editing ? 'Edit Field' : 'Add Field'}</h3>
                                <button onClick={() => setDialogOpen(false)} className="text-gray-500 hover:underline">
                                    Close
                                </button>
                            </div>
                            <div className="grid gap-3">
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input className="w-full rounded-xl border px-3 py-2" value={fName} onChange={(e) => setFName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Handle</label>
                                    <input
                                        className="w-full rounded-xl border px-3 py-2"
                                        value={fHandle}
                                        onChange={(e) => setFHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Alphanumeric + underscore, diawali huruf/underscore.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select className="w-full rounded-xl border px-3 py-2" value={fType} onChange={(e) => setFType(e.target.value)}>
                                        {TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={fRequired} onChange={(e) => setFRequired(e.target.checked)} /> Required
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Max</span>
                                        <input
                                            type="number"
                                            className="w-24 rounded-xl border px-3 py-2"
                                            value={fMax}
                                            onChange={(e) => setFMax(e.target.value === '' ? '' : Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setDialogOpen(false)} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button onClick={submitField} className="rounded-xl border px-4 py-2 hover:bg-gray-50">
                                    {editing ? 'Save' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
