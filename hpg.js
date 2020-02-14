var $$ = mdui.JQ;


function getProduct() {
    $$('#product option').filter(function (idx, e) {
        if (e.selected) {
            var product = e.value;
        }
    });
    return product.value
}


function getDomain() {
    $$('#domain option').filter(function (idx, e) {
        if (e.selected) {
            var domain = e.value;
        }
    });
    //console.log(domain.value);
    return domain.value;
}


function getPayment_method() {
    $$('#payment_method option').filter(function (idx, e) {
        if (e.selected) {
            var payment_method = e.value;
        }
    });
    return payment_method.value
}


function getPrice() {

    var lastname = $$('#lastname').val();
    var firstname = $$('#firstname').val();
    var product = getProduct();
    var domain = getDomain();

    var data = {
        'product': product,
        'domain': domain
    };

    if (
        lastname != '' &
        firstname != ''
    ) {
        $$('.waitprice').show();
        $$('.waitprice .mdui-spinner').show();
        $$('.waitprice .theprice').hide();
        //get price
        $$.ajax({
            method: 'POST',
            url: '/getPrice',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                console.log(data.price);
                $$('.theprice').html(data.price);
                $$('.waitprice .mdui-spinner').hide();
                $$('.waitprice .theprice').show();
            }
        });
    }

}

$$('#sendmail').on('click', function (e) {
    $$('#sendmaildiv').toggle();
});


$$('#product').on('close.mdui.select', function () {
    getPrice();
});

$$('#domain').on('close.mdui.select', function () {
    getPrice();
});

$$('.mdui-textfield').on('click', function () {
    getPrice();
});


function formSubmit(token) {

    var price = $$('.theprice span').html();

    var lastname = $$('#lastname').val();
    var firstname = $$('#firstname').val();
    var username = $$('#username').val();
    var contactemail = $$('#contactemail').val();
    var product = getProduct();
    var domain = getDomain();
    var payment_method = getPayment_method();

    var data = {
        'lastname': lastname,
        'firstname': firstname,
        'username': username,
        'contactemail': contactemail,
        'product': product,
        'domain': domain,
        'payment_method': payment_method
    };

    mdui.dialog({
        title: '支付',
        content: `点击确认后您需支付 ${price} 元，期间请勿刷新网页。`,
        modal: true,
        buttons: [
            {
                text: '取消',
                onClick: function (inst) {
                    grecaptcha.reset();
                }
            },
            {
                text: '确认',
                onClick: function (inst) {
                    //html change
                    $$('.enroll h2').html('请稍后...');
                    $$('.accountinfo').hide();
                    $$('.checkout').hide();
                    $$('.mdui-progress').show();
                    $$('.bg3').css('height', '100vh');
                    //post data
                    $$.ajax({
                        method: 'POST',
                        url: '/checkout',
                        data: JSON.stringify(data),
                        dataType: 'json',
                        success: function (data) {
                            console.log(data);
                        }
                    });

                }
            }
        ]
    });


}
