import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Edit Content Type</CardTitle>
                            <Button asChild variant="ghost">
                                <Link href={route('admin.content-types.index')}>Back</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="type-name">Name</Label>
                                <Input id="type-name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="type-slug">Slug</Label>
                                <Input
                                    id="type-slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={saveType}>Save Type</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Fields</CardTitle>
                            <Button onClick={openAdd}>+ Add Field</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div onDrop={onDropList} onDragOver={(e) => e.preventDefault()} className="rounded-xl border bg-gray-50/50">
                            {rows.length === 0 && <div className="p-6 text-center text-gray-500">No fields yet.</div>}
                            {rows.map((f: Field) => (
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
                                        <Button onClick={() => openEdit(f)} variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                        <Button onClick={() => delField(f)} variant="ghost" size="sm">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {rows.length > 0 && (
                            <div className="flex justify-end pt-3">
                                <Button onClick={onDropList}>Save Order</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {dialogOpen && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit Field' : 'Add Field'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="f-name">Name</Label>
                                    <Input id="f-name" value={fName} onChange={(e) => setFName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="f-handle">Handle</Label>
                                    <Input id="f-handle" value={fHandle} onChange={(e) => setFHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} />
                                    <p className="mt-1 text-xs text-gray-500">Alphanumeric + underscore, diawali huruf/underscore.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="f-type">Type</Label>
                                    <Select value={fType} onValueChange={setFType}>
                                        <SelectTrigger id="f-type">
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPES.map((t: string) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="f-required" checked={fRequired} onCheckedChange={(e) => setFRequired(!!e)} />
                                        <Label htmlFor="f-required" className="text-sm">
                                            Required
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Max</span>
                                        <Input
                                            type="number"
                                            className="w-24"
                                            value={fMax}
                                            onChange={(e) => setFMax(e.target.value === '' ? '' : Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button onClick={() => setDialogOpen(false)} variant="ghost">
                                    Cancel
                                </Button>
                                <Button onClick={submitField}>{editing ? 'Save' : 'Add'}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
}
