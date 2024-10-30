<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\VariantController;
use Illuminate\Support\Facades\Route;



Route::get('/sliders', [SliderController::class, 'index'])->name('sliders.index');        // Get all sliders
// Delete a slider

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
Route::get('user/group', [GroupController::class, 'viewGroupsUser']);


//////////////////////

/////////////////////////

// CUSTOMER ROUTES START/////////////////////////////////////////////////////

Route::middleware('auth:sanctum')->group(function () {     //user must be signed in

    Route::get('check/user', [AuthController::class, 'check']);

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
    Route::delete('clearcart', [CartController::class, 'clearCart']);
    Route::get('viewcart', [CartController::class, 'viewCart']);

    //////////////////////////

    //Order Routes

    Route::post('/createorder', [OrderController::class, 'createOrder']);
    Route::get('/order/{id}', [OrderController::class, 'viewOrder']);
    Route::get('/myorders', [OrderController::class, 'viewMyOrders']);

    ////////////////////////////

});

//////////////////////////

// ADMIN ROUTES START//////////////////////////////////////////////////

Route::middleware(['auth:sanctum', 'IsAdmin'])->group(function () {     //user must be signed in as an admin

    Route::get('check/admin', [AdminController::class, 'check']);


    //Slider Routes

    Route::get('/sliders/{id}', [SliderController::class, 'show'])->name('sliders.show');     // Get single slider
    Route::post('/sliders', [SliderController::class, 'createSlider'])->name('sliders.store'); // Create a slider
    Route::put('/sliders/{id}', [SliderController::class, 'update'])->name('sliders.update');  // Update a slider
    Route::delete('/sliders/{id}', [SliderController::class, 'destroy'])->name('sliders.destroy');

    //Product Routes

    Route::get('adminproduct', [ProductController::class, 'getAllProducts']);
    Route::get('adminproduct/{id}', [ProductController::class, 'viewAnyProduct']);
    Route::patch('hide/{id}', [ProductController::class, 'hideProduct']);
    Route::patch('show/{id}', [ProductController::class, 'showProduct']);
    Route::delete('product/{id}', [ProductController::class, 'deleteProduct']);
    Route::put('product/{id}', [ProductController::class, 'updateProduct']);
    Route::post('product', [ProductController::class, 'addProduct']);

    //////////////

    //User Profiles Routes

    Route::get('view_user/{id}', [AdminController::class, 'viewUser']);
    Route::get('view_user', [AdminController::class, 'viewSelf']);
    Route::get('active_users', [AdminController::class, 'viewActiveUsers']);
    Route::get('all_users', [AdminController::class, 'viewAllUsers']);
    Route::put('admin_updates_profile/{id}', [AdminController::class, 'adminUpdatesProfile']);
    Route::put('admin_updates_profile', [AdminController::class, 'adminUpdatesSelf']);
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
    Route::get('group', [GroupController::class, 'viewGroupsAdmin']);


    ////////////////

    //Order Routes 

    Route::get('/user/orders/{id}', [OrderController::class, 'viewOrdersOfUser']);
    Route::get('/allorders', [OrderController::class, 'viewAllOrders']);
    Route::patch('/order/{id}', [OrderController::class, 'changeOrderStatus']);
    Route::delete('/order/{id}', [OrderController::class, 'deleteOrder']);

    /////////////////////////////////

});

//////////////////////