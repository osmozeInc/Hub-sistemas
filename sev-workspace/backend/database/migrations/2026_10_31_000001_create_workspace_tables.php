<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->string('id')->primary(); // Ex: 'sev-market', 'personal-amanda'
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('category')->default('Vitrine');
            $table->string('status')->default('dev'); // active, warning, dev
            $table->string('status_text')->nullable();
            $table->string('image')->nullable();
            
            // Identificadores para Automação Google (Centralizados na conta da Agência)
            $table->string('ga4_property_id')->nullable(); // Ex: 'properties/123456789'
            $table->string('gsc_site_url')->nullable();    // Ex: 'https://amandapersonal.com.br/'

            // Colunas JSONB: Flexibilidade total para mudar campos no MVP sem novas migrations
            $table->jsonb('tags')->default('[]');
            $table->jsonb('domain')->default('{}');
            $table->jsonb('palette')->default('[]');
            $table->jsonb('dossier')->default('[]');
            $table->jsonb('routes')->default('[]');
            $table->jsonb('health')->default('{}');
            $table->jsonb('analytics_summary')->default('{}');

            $table->timestamp('last_audited_at')->nullable();
            $table->timestamps();
        });

        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->string('project_id');
            $table->string('project_title');
            $table->string('title');
            $table->string('frequency')->default('Mensal · Todo dia 05');
            $table->string('category')->default('Operação');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
        Schema::dropIfExists('projects');
    }
};