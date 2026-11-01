<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $fillable = [
        'project_id', 'project_title', 'title', 'frequency', 'category', 'completed'
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];
}