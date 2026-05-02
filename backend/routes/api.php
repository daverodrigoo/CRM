<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EmployeeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/leads', [LeadController::class, 'index']);

Route::post('/leads', [LeadController::class, 'store']); 

Route::delete('/leads/{id}', [LeadController::class, 'destroy']);
Route::put('/assigned-leads/{assignedLeadId}', [LeadController::class, 'updateAssignedLeadPipeline']);
Route::put('/assignment-batches/{batchId}', [LeadController::class, 'updateBatchName']);
Route::delete('/assignment-batches/{batchId}', [LeadController::class, 'deleteBatch']);
Route::get('/assigned-leads/summary', [LeadController::class, 'getAllAssignedLeadsSummary']);

// Employee Management Routes
Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees', [EmployeeController::class, 'store']);
Route::put('/employees/{id}', [EmployeeController::class, 'update']);
Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
Route::post('/leads/assign', [LeadController::class, 'assignLeads']);
Route::get('/leads/assigned/{userId}', [LeadController::class, 'getAssignedLeads']);
Route::put('/assigned-leads/{id}/book-meeting', [App\Http\Controllers\Api\LeadController::class, 'bookMeeting']);
Route::get('/meetings/admin/{userId}', [App\Http\Controllers\Api\LeadController::class, 'getAdminMeetings']);
Route::get('/meetings/employee-booked/{employeeId}', [App\Http\Controllers\Api\LeadController::class, 'getEmployeeBookedMeetings']);

Route::put('/leads/{id}', [LeadController::class, 'update']);
Route::put('/leads/{id}/pipeline', [LeadController::class, 'updatePipeline']);
Route::get('/leads/{id}/history', [LeadController::class, 'getLeadHistory']);