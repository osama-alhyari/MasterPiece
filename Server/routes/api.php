<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VariantController;
use Illuminate\Support\Facades\Route;






// PUBLIC ROUTES START////////////////////////////////////////////////////////

//Registration Routes

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

/////////

//Product Routes

Route::get('product', [ProductController::class, 'getAvailableProducts']);
Route::get('product/{id}', [ProductController::class, 'viewProductIfAvailable']);

////////////

//Variant Routes

Route::get('/variant/{id}', [VariantController::class, 'viewVariant']);
Route::get('/allvariants/{id}', [VariantController::class, 'viewAllVariants']);

//////////

//Group Routes

Route::get('group/{id}', [GroupController::class, 'viewGroup']);
Route::get('group', [GroupController::class, 'viewGroups']);

//////////////////////

/////////////////////////

// CUSTOMER ROUTES START/////////////////////////////////////////////////////

Route::middleware('auth:sanctum')->group(function () {     //user must be signed in

    //Profile Routes

    Route::get('/profile', [CustomerController::class, 'viewProfile']);
    Route::put('/customer_updates_profile', [CustomerController::class, 'customerUpdatesProfile']);
    Route::delete('/customer_deletes_profile', [CustomerController::class, 'customerDeletesProfile']);

    /////////////////////////////////

    //Cart Routes 

    Route::post('addItem/{id}', [CartController::class, 'addItem']);
    Route::patch('incrementItem/{id}', [CartController::class, 'incrementItem']);
    Route::patch('decrementItem/{id}', [CartController::class, 'decrementItem']);
    Route::delete('deleteItem/{id}', [CartController::class, 'removeItem']);

//////////////////////////

});

//////////////////////////

// ADMIN ROUTES START//////////////////////////////////////////////////

Route::middleware(['auth:sanctum', 'IsAdmin'])->group(function () {     //user must be signed in as an admin

//Product Routes

    Route::get('adminproduct', [ProductController::class, 'getAllProducts']);
    Route::get('adminproduct/{id}', [ProductController::class, 'viewAnyProduct']);
    Route::patch('hide/{id}', [ProductController::class, 'hideProduct']);
    Route::patch('show/{id}', [ProductController::class, 'showProduct']);
    Route::delete('product/{id}', [ProductController::class, 'deleteProduct']);
    Route::put('product/{id}', [ProductController::class, 'updateProduct']);
    Route::post('product', [ProductController::class, 'addProduct']);

//////////////

//User Related Routes

    Route::get('view_user/{id}', [AdminController::class, 'viewUser']);
    Route::get('active_users', [AdminController::class, 'viewActiveUsers']);
    Route::get('all_users', [AdminController::class, 'viewAllUsers']);
    Route::put('admin_updates_profile/{id}', [AdminController::class, 'adminUpdatesProfile']);
    Route::delete('admin_deletes_user/{id}', [AdminController::class, 'adminDeletesCustomer']);

    //////////////    

    Route::delete('/image/{id}', [VariantController::class, 'deleteImage']);

    //Variant Routes

    Route::patch('/setstock/{id}', [VariantController::class, 'setVariantStock']);
    Route::patch('/increasestock/{id}', [VariantController::class, 'increaseStock']);
    Route::patch('/decreasestock/{id}', [VariantController::class, 'decreaseStock']);
    Route::post('/variant', [VariantController::class, 'addVariant']);
    Route::put('/variant/{id}', [VariantController::class, 'updateVariant']);
    Route::delete('/variant/{id}', [VariantController::class, 'deleteVariant']);

    /////////////////

    //Group Routes

    Route::post('group', [GroupController::class, 'addGroup']);
    Route::put('group/{id}', [GroupController::class, 'updateGroup']);
    Route::delete('group/{id}', [GroupController::class, 'deleteGroup']);

////////////////

});

//////////////////////