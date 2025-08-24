import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [saving, setSaving] = useState(false);

    const toSlug = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    return (
        <>
            <Head title="New Content Type" />
            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">New Content Type</h1>
                    <Link href={route('admin.content-types.index')} className="text-sm underline">
                        Back
                    </Link>
                </div>
                <div className="space-y-4 rounded-2xl border p-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!slug) setSlug(toSlug(e.target.value));
                            }}
                            placeholder="Article"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Slug</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={slug}
                            onChange={(e) => setSlug(toSlug(e.target.value))}
                            placeholder="article"
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            disabled={saving}
                            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                            onClick={() => {
                                setSaving(true);
                                router.post(
                                    route('admin.content-types.store'),
                                    { name, slug },
                                    {
                                        onFinish: () => setSaving(false),
                                    },
                                );
                            }}
                        >
                            {saving ? 'Saving…' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
