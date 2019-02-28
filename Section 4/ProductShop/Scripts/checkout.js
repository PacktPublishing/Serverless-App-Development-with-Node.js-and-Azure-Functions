checkout = function () {
    var vm_formElement = function (data) {
        var self = this;
        ko.mapping.fromJS(data, null, self);
    };
    var checkoutko;



    var checkoutViewModel = function () {
        var self = this;
        self.key = ko.observable("pk_test_hni2km8bC885YfETmJHNfRzQ");
        self.amount = ko.observable(0);

        self.getCart = function () {

            $.ajax({
                url: "https://productsshop.azurewebsites.net/api/GetCart",
                type: 'POST',
                contentType: 'application/json',
                success: function (result) {
                    
                    if (result.indexOf("No") === -1) {
                        var resultJSON = JSON.parse(result);

                        $.each(resultJSON, function (key, value) {
                            var price = Number(value.price);
                            checkoutko.amount(checkoutko.amount() + price);
                        });

                            checkoutko.amount(checkoutko.amount() * 100);
                        

                    }

                },
                error: function () {
                }
            });
        };

    };

    var load = function () {
        checkoutko = new checkoutViewModel();
        ko.applyBindings(checkoutko);      
        checkoutko.getCart();

        var handler = StripeCheckout.configure({
            key: checkoutko.key(),
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function (token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                var tokenObj = { "token":  token.id , "amount": checkoutko.amount(), "email": token.email  };
                $.ajax({
                    url: "https://productsshop.azurewebsites.net/api/PaymentHandler/tokenObj/" + JSON.stringify(tokenObj),
                    type: 'POST',
                    contentType: 'application/json',
                    success: function (msg) {
                       
                        alert(msg);
                    },
                    error: function (msg) {
                        alert("error");
                    }
                });
            }
        });


        document.getElementById('customButton').addEventListener('click', function (e) {
            // Open Checkout with further options:
            handler.open({
                name: 'Products Shop',
                description: 'widgets',
                amount: checkoutko.amount()
            });
            e.preventDefault();
        });

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
            handler.close();
        });


    };

    return {
        load: load
    };
}();