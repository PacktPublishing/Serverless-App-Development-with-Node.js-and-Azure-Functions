productsList = function () {
    var vm_formElement = function (data) {
        var self = this;
        ko.mapping.fromJS(data, null, self);
    };
    var productsko;

    var productsViewModel = function () {
        var self = this;
        self.products = ko.observableArray([]);
        self.price1 = ko.observable();
        self.price2 = ko.observable();



        self.getProducts = function () {

            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/ProductsList",
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    productsko.products([]);
                    if (result.indexOf("No") === -1) {
                        var resultJSON = JSON.parse(result);

                        $.each(resultJSON, function (key, value) {
                            productsko.products.push(new vm_formElement(value));
                        });

                    }

                },
                error: function () {
                }
            });
        };

        self.getFilteredProducts = function () {
            var priceJson = { "price1": productsko.price1(), "price2": productsko.price2() };
            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/FilteredProducts/filter/" + JSON.stringify( priceJson),
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    productsko.products([]);

                    if (result.indexOf("No") === -1) {
                        var resultJSON = JSON.parse(result);

                        $.each(resultJSON, function (key, value) {
                            productsko.products.push(new vm_formElement(value));
                        });
                    }
                    

                },
                error: function () {
                }
            });
        };

        self.addToCart = function (data) {
            var cartData = { "id": "", "productId": data.id(), "name": data.name(), "image": productsko.GetFilename( data.image()), "price": data.price() };
            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/AddToCart/cart/" + JSON.stringify(cartData),
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    alert("success");
                    window.location = "/cart.html";
                },
                error: function (msg) {
                    alert(msg);
                }
            });
        };

        self.GetFilename=function (url)
        {
            if (url) {
                var m = url.toString().match(/.*\/(.+?)\./);
                if (m && m.length > 1) {
                    return m[1];
                }
            }
            return "";
        }


    };

    var load = function () {
        productsko = new productsViewModel();
        ko.applyBindings(productsko);

        var slider = document.getElementById('price-slider');
        if (slider) {
            noUiSlider.create(slider, {
                start: [1, 999],
                connect: true,
                tooltips: [true, true],
                format: {
                    to: function (value) {
                        return value.toFixed(2) + '$';
                    },
                    from: function (value) {
                        return value;
                    }
                },
                range: {
                    'min': 1,
                    'max': 999
                }

            });

            slider.noUiSlider.on('change', function (values) {
                productsko.products([]);
                productsko.price1(values[0]);
                productsko.price2(values[1]);
                productsko.getFilteredProducts();
            });
        }
        productsko.getProducts();
    };

    return {
        load: load
    };
}();