<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="{{route('addProduct')}}" method="post" enctype="multipart/form-data">
        @csrf
        <input type="text" name="product_name" placeholder="pname">
        <input type="text" name="description" placeholder="descc">
        <input type="number" name="price" placeholder="price">
        <input type="file" name="product_cover">
        <input type="hidden" value="1" name="categories[]">
        <input type="hidden" value="2" name="categories[]">
        <input type="hidden" name="number_of_variants" value="2">
        <h1>here arrays</h1>
        <input type="text" name="skus[]" placeholder="sku">
        <input type="text" name="variant_names[]" placeholder="variant_name">
        <input type="number" name="stocks[]" placeholder="stock">
        <input type="file" name="images_arrays[0][]" multiple>
        <input type="hidden" name="variant_cover_image_indexes[]" value="0">
        <h2>another one</h2>
        <input type="text" name="skus[]" placeholder="sku">
        <input type="text" name="variant_names[]" placeholder="variant_name">
        <input type="number" name="stocks[]" placeholder="stock">
        <input type="file" name="images_arrays[1][]" multiple>
        <input type="hidden" name="variant_cover_image_indexes[]" value="0">
        <input type="submit">
    </form>
</body>

</html>