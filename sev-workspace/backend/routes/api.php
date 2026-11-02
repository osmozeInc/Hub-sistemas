<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WorkspaceController;

Route::prefix('workspace')->group(function () {
    Route::get('/bootstrap', [WorkspaceController::class, 'bootstrap']);
    Route::post('/projects', [WorkspaceController::class, 'storeProject']);
    Route::patch('/projects/{id}', [WorkspaceController::class, 'upsertProject']);
    Route::delete('/projects/{id}', [WorkspaceController::class, 'destroyProject']);
    Route::post('/projects/{id}/audit', [WorkspaceController::class, 'runAudit']);

    Route::post('/reminders', [WorkspaceController::class, 'storeReminder']);
    Route::patch('/reminders/{reminder}/toggle', [WorkspaceController::class, 'toggleReminder']);
    Route::delete('/reminders/{reminder}', [WorkspaceController::class, 'destroyReminder']);

    Route::post('/projects/{id}/share-token', [WorkspaceController::class, 'generateShareToken']);
    Route::get('/public/{token}', [WorkspaceController::class, 'publicClientView']);
    Route::post('/projects/{id}/ga4', [WorkspaceController::class, 'syncGa4']);

    Route::post('/resources', [WorkspaceController::class, 'storeResource']);
    Route::patch('/resources/{resource}', [WorkspaceController::class, 'updateResource']);
    Route::delete('/resources/{resource}', [WorkspaceController::class, 'destroyResource']);
});