import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
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
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>New Content Type</CardTitle>
                            <Button asChild variant="ghost">
                                <Link href={route('admin.content-types.index')}>Back</Link>
                            </Button>
                        </div>
                        <CardDescription>Create a new content type to define the structure for your entries.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!slug) setSlug(toSlug(e.target.value));
                                }}
                                placeholder="Article"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={slug} onChange={(e) => setSlug(toSlug(e.target.value))} placeholder="article" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            disabled={saving}
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
                            {saving ? (
                                <span className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                                </span>
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
