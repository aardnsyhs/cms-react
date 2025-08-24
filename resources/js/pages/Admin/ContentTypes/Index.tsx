import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

type ContentType = {
    id: number;
    name: string;
    slug: string;
    settings?: Record<string, unknown> | null;
    entries_count: number;
    updated_at: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PageProps = {
    types: Paginated<ContentType>;
    filters: { q?: string };
    can: { create: boolean; update: boolean; delete: boolean };
};

export default function Index() {
    const { types, filters, can } = usePage<PageProps>().props;
    const [q, setQ] = useState<string>(filters?.q ?? '');

    useEffect(() => {
        setQ(filters?.q ?? '');
    }, [filters?.q]);

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.content-types.index'), { q }, { preserveState: true, replace: true });
    };

    const rows = useMemo(() => types.data ?? [], [types]);

    return (
        <>
            <Head title="Content Types" />
            <div className="mx-auto max-w-6xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Content Types</h1>
                    {can.create && (
                        <Link
                            href="#"
                            className="inline-flex items-center rounded-xl border px-4 py-2 shadow-sm hover:bg-gray-50"
                            // TODO: ganti ke route create kalau sudah ada
                        >
                            + New Type
                        </Link>
                    )}
                </div>
                <form onSubmit={onSearch} className="flex items-center gap-2">
                    <input
                        className="w-full rounded-xl border px-3 py-2 md:w-80"
                        placeholder="Search name or slug…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button type="submit" className="rounded-xl border px-4 py-2 shadow-sm hover:bg-gray-50">
                        Search
                    </button>
                    {filters?.q && (
                        <Link
                            href={route('admin.content-types.index')}
                            className="rounded-xl border px-3 py-2 shadow-sm hover:bg-gray-50"
                            preserveState
                            replace
                        >
                            Reset
                        </Link>
                    )}
                </form>
                <div className="overflow-hidden rounded-2xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Slug</th>
                                <th className="px-4 py-3 text-left font-medium">Entries</th>
                                <th className="px-4 py-3 text-left font-medium">Updated</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                                        No content types found.
                                    </td>
                                </tr>
                            )}
                            {rows.map((t) => (
                                <tr key={t.id} className="border-t">
                                    <td className="px-4 py-3">{t.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{t.slug}</td>
                                    <td className="px-4 py-3">{t.entries_count}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(t.updated_at).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href="#" className="rounded-lg border px-3 py-1 hover:bg-gray-50">
                                                View
                                            </Link>
                                            {can.update && (
                                                <Link href="#" className="rounded-lg border px-3 py-1 hover:bg-gray-50">
                                                    Edit
                                                </Link>
                                            )}
                                            {can.delete && (
                                                <button
                                                    className="rounded-lg border px-3 py-1 hover:bg-red-50"
                                                    onClick={() => alert('TODO: delete')}
                                                    type="button"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {types.links?.length > 0 && (
                    <nav className="flex flex-wrap items-center gap-2">
                        {types.links.map((l, idx) => (
                            <Link
                                key={idx}
                                href={l.url ?? '#'}
                                className={`rounded-lg border px-3 py-1 ${
                                    l.active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                                } ${!l.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                                preserveState
                                replace
                            />
                        ))}
                    </nav>
                )}
            </div>
        </>
    );
}
