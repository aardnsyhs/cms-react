<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Entry extends Model
{
    /** @use HasFactory<\Database\Factories\EntryFactory> */
    use HasFactory;

    protected $keyType = 'string';
    protected $fillable = [
        'content_type_id',
        'status',
        'locale',
        'slug',
        'schedule_at',
        'publish_at',
        'unpublish_at',
        'created_by',
        'updated_by'
    ];
    protected $casts = [
        'schedule_at' => 'datetime',
        'publish_at' => 'datetime',
        'unpublish_at' => 'datetime'
    ];
    public $incrementing = false;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function type()
    {
        return $this->belongsTo(ContentType::class, 'content_type_id');
    }
    public function versions()
    {
        return $this->hasMany(EntryVersion::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
