<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EntryVersion extends Model
{
    /** @use HasFactory<\Database\Factories\EntryVersionFactory> */
    use HasFactory;

    protected $keyType = 'string';
    protected $fillable = ['entry_id', 'version', 'data', 'created_by', 'created_at', 'comment'];
    protected $casts = ['data' => 'array', 'created_at' => 'datetime'];
    public $incrementing = false;
    public $timestamps = false;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }
}
