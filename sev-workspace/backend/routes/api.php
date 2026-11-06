<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WorkspaceController;

Route::prefix('workspace')->group(function () {
    // ROTAS PÚBLICAS (Sem necessidade de login)
    Route::post('/login', [WorkspaceController::class, 'login']);
    Route::get('/public/{token}', [WorkspaceController::class, 'publicClientView']);

    // ROTAS PROTEGIDAS (Exigem Token de Login válido)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [WorkspaceController::class, 'me']);
        Route::post('/logout', [WorkspaceController::class, 'logout']);
        Route::get('/bootstrap', [WorkspaceController::class, 'bootstrap']);

        Route::post('/projects', [WorkspaceController::class, 'storeProject']);
        Route::patch('/projects/{id}', [WorkspaceController::class, 'upsertProject']);
        Route::delete('/projects/{id}', [WorkspaceController::class, 'destroyProject']);
        Route::post('/projects/{id}/audit', [WorkspaceController::class, 'runAudit']);
        Route::post('/projects/{id}/ga4', [WorkspaceController::class, 'syncGa4']);
        Route::post('/projects/{id}/share-token', [WorkspaceController::class, 'generateShareToken']);

        Route::post('/reminders', [WorkspaceController::class, 'storeReminder']);
        Route::patch('/reminders/{reminder}/toggle', [WorkspaceController::class, 'toggleReminder']);
        Route::delete('/reminders/{reminder}', [WorkspaceController::class, 'destroyReminder']);

        Route::post('/resources', [WorkspaceController::class, 'storeResource']);
        Route::patch('/resources/{resource}', [WorkspaceController::class, 'updateResource']);
        Route::delete('/resources/{resource}', [WorkspaceController::class, 'destroyResource']);
    });
});