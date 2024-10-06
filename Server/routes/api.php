<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('adminproduct', [ProductController::class, 'getAllProducts']);
Route::get('product', [ProductController::class, 'getAvailableProducts']);
Route::post('product', [ProductController::class, 'addProduct']);
Route::get('adminproduct/{id}', [ProductController::class, 'viewAnyProduct']);
Route::get('product/{id}', [ProductController::class, 'viewProductIfAvailable']);
Route::put('product/{id}', [ProductController::class, 'updateProduct']);
Route::delete('product/{id}', [ProductController::class, 'deleteProduct']);
Route::patch('hide/{id}', [ProductController::class, 'hideProduct']);
Route::patch('show/{id}', [ProductController::class, 'showProduct']);


Route::middleware('auth:sanctum')->group(function () {     //user must be signed in
    Route::get('/profile', [CustomerController::class, 'viewProfile']);
    Route::put('/customer_updates_profile', [CustomerController::class, 'customerUpdatesProfile']);
    Route::delete('/customer_deletes_profile', [CustomerController::class, 'customerDeletesProfile']);
});

Route::middleware(['auth:sanctum', 'IsAdmin'])->group(function () {     //user must be signed in as an admin
    Route::get('view_user/{id}', [AdminController::class, 'viewUser']);
    Route::get('active_users', [AdminController::class, 'viewActiveUsers']);
    Route::get('all_users', [AdminController::class, 'viewAllUsers']);
    Route::put('admin_updates_profile/{id}', [AdminController::class, 'adminUpdatesProfile']);
    Route::delete('admin_deletes_user/{id}', [AdminController::class, 'adminDeletesCustomer']);
});
