<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = [
            'Admin',
            'Editor',
            'Reviewer',
        ];

        foreach ($roles as $r) {
            Role::firstOrCreate(['name' => $r]);
        }

        $permissions = [
            'content_types.view',
            'content_types.create',
            'content_types.update',
            'content_types.delete',

            'entries.view',
            'entries.create',
            'entries.update',
            'entries.publish',
            'entries.delete',

            'media.view',
            'media.upload',
            'media.delete',

            'webhooks.view',
            'webhooks.create',
            'webhooks.update',
            'webhooks.delete',

            'api_keys.view',
            'api_keys.create',
            'api_keys.revoke',
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p]);
        }

        /** @var \Spatie\Permission\Models\Role $admin */
        $admin = Role::where('name', 'Admin')->first();
        $admin->syncPermissions(Permission::pluck('name')->all());

        /** @var \Spatie\Permission\Models\Role $editor */
        $editor = Role::where('name', 'Editor')->first();
        $editorPerms = [
            'content_types.view',
            'entries.view',
            'entries.create',
            'entries.update',
            'entries.publish',
            'media.view',
            'media.upload',
        ];
        $editor->syncPermissions($editorPerms);

        /** @var \Spatie\Permission\Models\Role $reviewer */
        $reviewer = Role::where('name', 'Reviewer')->first();
        $reviewerPerms = [
            'entries.view',
            'entries.update',
            'entries.publish',
            'media.view',
        ];
        $reviewer->syncPermissions($reviewerPerms);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['Admin', 'Editor', 'Reviewer'] as $r) {
            if ($role = Role::where('name', $r)->first()) {
                $role->syncPermissions([]);
                $role->delete();
            }
        }

        $permNames = [
            'content_types.view',
            'content_types.create',
            'content_types.update',
            'content_types.delete',
            'entries.view',
            'entries.create',
            'entries.update',
            'entries.publish',
            'entries.delete',
            'media.view',
            'media.upload',
            'media.delete',
            'webhooks.view',
            'webhooks.create',
            'webhooks.update',
            'webhooks.delete',
            'api_keys.view',
            'api_keys.create',
            'api_keys.revoke',
        ];
        Permission::whereIn('name', $permNames)->delete();
    }
};
