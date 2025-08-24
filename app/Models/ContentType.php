<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContentType extends Model
{
    /** @use HasFactory<\Database\Factories\ContentTypeFactory> */
    use HasFactory;

    protected $keyType = 'string';
    protected $fillable = ['name', 'slug', 'settings'];
    protected $casts = ['settings' => 'array'];
    public $incrementing = false;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function fields()
    {
        return $this->hasMany(ContentField::class);
    }
    public function entries()
    {
        return $this->hasMany(Entry::class);
    }
}
