cartList = function () {
    var vm_formElement = function (data) {
        var self = this;
        ko.mapping.fromJS(data, null, self);
    };
    var cartko;

    var cartViewModel = function () {
        var self = this;
        self.cartProducts = ko.observableArray([]);
        self.subTotal = ko.observable(0);
        self.shipping = ko.observable(0);
        self.total = ko.observable(0);

        self.getCart = function () {

            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/GetCart",
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    cartko.cartProducts([]);
                    if (result.indexOf("No") === -1) {
                        var resultJSON = JSON.parse(result);

                        $.each(resultJSON, function (key, value) {
                            cartko.cartProducts.push(new vm_formElement(value));
                            var price = parseInt(value.price);
                            cartko.subTotal(cartko.subTotal() + price);
                        });
                        cartko.total(cartko.total());

                    }

                },
                error: function () {
                }
            });
        };

        self.removeFromCart = function (data) {
        };

        self.addToCart = function (data) {
            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/AddToCart/cart/" + ko.toJSON(data),
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    alert("success");
                    window.location = "/cart.html";
                },
                error: function () {
                    alert("error");
                }
            });
        };


    };

    var load = function () {
        cartko = new cartViewModel();
        ko.applyBindings(cartko);

      
        cartko.getCart();
    };

    return {
        load: load
    };
}();