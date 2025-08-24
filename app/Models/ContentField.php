<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContentField extends Model
{
    /** @use HasFactory<\Database\Factories\ContentFieldFactory> */
    use HasFactory;

    protected $keyType = 'string';
    protected $fillable = ['content_type_id', 'name', 'handle', 'type', 'options', 'order'];
    protected $casts = ['options' => 'array'];
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
}
