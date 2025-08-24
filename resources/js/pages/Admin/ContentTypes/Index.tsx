import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

type ContentType = {
    id: string;
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
                        <Button asChild>
                            <Link href={route('admin.content-types.create')}>+ New Type</Link>
                        </Button>
                    )}
                </div>
                <form onSubmit={onSearch} className="flex items-center gap-2">
                    <Input className="w-full md:w-80" placeholder="Search name or slug…" value={q} onChange={(e) => setQ(e.target.value)} />
                    <Button type="submit">Search</Button>
                    {filters?.q && (
                        <Button asChild variant="ghost">
                            <Link href={route('admin.content-types.index')} preserveState replace>
                                Reset
                            </Link>
                        </Button>
                    )}
                </form>
                <Card>
                    <CardHeader>
                        <CardTitle>List of Content Types</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Entries</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            No content types found.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {rows.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium">{t.name}</TableCell>
                                        <TableCell className="text-gray-600">{t.slug}</TableCell>
                                        <TableCell>{t.entries_count}</TableCell>
                                        <TableCell className="text-gray-500">{new Date(t.updated_at).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm">
                                                    <Link href="#">View</Link>
                                                </Button>
                                                {can.update && (
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={route('admin.content-types.edit', t.id)}>Edit</Link>
                                                    </Button>
                                                )}
                                                {can.delete && (
                                                    <Button variant="ghost" size="sm" onClick={() => alert('TODO: delete')}>
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {types.links?.length > 0 && (
                    <div className="flex items-center justify-center">
                        <Pagination>
                            <PaginationContent>
                                {types.links.map((l, idx) => {
                                    const isPrev = l.label === '&laquo; Previous';
                                    const isNext = l.label === 'Next &raquo;';
                                    const label = isPrev ? 'Previous' : isNext ? 'Next' : l.label;
                                    return (
                                        <PaginationItem key={idx}>
                                            <Button asChild variant={l.active ? 'outline' : 'ghost'} size="sm" disabled={!l.url}>
                                                <Link href={l.url ?? '#'} preserveState replace>
                                                    <span dangerouslySetInnerHTML={{ __html: label }} />
                                                </Link>
                                            </Button>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </>
    );
}
