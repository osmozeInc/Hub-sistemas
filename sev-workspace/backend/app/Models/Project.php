<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'subtitle', 'category', 'status', 'status_text',
        'image', 'ga4_property_id', 'gsc_site_url', 'tags', 'domain', 'infrastructure',
        'palette', 'dossier', 'routes', 'health', 'analytics_summary', 'last_audited_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'domain' => 'array',
        'palette' => 'array',
        'dossier' => 'array',
        'routes' => 'array',
        'infrastructure' => 'array',
        'health' => 'array',
        'analytics_summary' => 'array',
        'last_audited_at' => 'datetime',
    ];

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class, 'project_id', 'id');
    }
}