<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VariantController;
use Illuminate\Support\Facades\Route;


Route::post('/variant', [VariantController::class, 'addVariant']);
Route::delete('/variant/{id}', [VariantController::class, 'deleteVariant']);
Route::get('/variant/{id}', [VariantController::class, 'viewVariant']);
Route::get('/allvariants/{id}', [VariantController::class, 'viewAllVariants']);
Route::delete('/image/{id}', [VariantController::class, 'deleteImage']);



// PUBLIC ROUTES START

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('product', [ProductController::class, 'getAvailableProducts']);
Route::get('product/{id}', [ProductController::class, 'viewProductIfAvailable']);

/////////////////////////

// CUSTOMER ROUTES START

Route::middleware('auth:sanctum')->group(function () {     //user must be signed in
    Route::get('/profile', [CustomerController::class, 'viewProfile']);
    Route::put('/customer_updates_profile', [CustomerController::class, 'customerUpdatesProfile']);
    Route::delete('/customer_deletes_profile', [CustomerController::class, 'customerDeletesProfile']);
});

//////////////////////////

// ADMIN ROUTES START

Route::middleware(['auth:sanctum', 'IsAdmin'])->group(function () {     //user must be signed in as an admin
    Route::get('adminproduct', [ProductController::class, 'getAllProducts']);
    Route::get('adminproduct/{id}', [ProductController::class, 'viewAnyProduct']);
    Route::patch('hide/{id}', [ProductController::class, 'hideProduct']);
    Route::patch('show/{id}', [ProductController::class, 'showProduct']);
    Route::delete('product/{id}', [ProductController::class, 'deleteProduct']);
    Route::put('product/{id}', [ProductController::class, 'updateProduct']);
    Route::post('product', [ProductController::class, 'addProduct']);
    Route::get('view_user/{id}', [AdminController::class, 'viewUser']);
    Route::get('active_users', [AdminController::class, 'viewActiveUsers']);
    Route::get('all_users', [AdminController::class, 'viewAllUsers']);
    Route::put('admin_updates_profile/{id}', [AdminController::class, 'adminUpdatesProfile']);
    Route::delete('admin_deletes_user/{id}', [AdminController::class, 'adminDeletesCustomer']);
});

//////////////////////