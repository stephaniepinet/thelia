// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/* JQUERY PREVENT CONFLICT */
(function ($) {

/*  ------------------------------------------------------------------
    callback Function ------------------------------------------------ */
    var confirmCallback = {
        'address.delete': function ($elm) {
            $.post($elm.attr('href'), function (data) {
                if (data.success) {
                    $elm.closest('tr').remove();
                } else {
                    bootbox.alert(data.message);
                }
            });
        }
    };


/*  ------------------------------------------------------------------
     onLoad Function ------------------------------------------------- */
    $(document).ready(function () {

        // Loader
        var $loader = $('<div class="loader"></div>');
        $('body').append($loader);

        // Display loader if we do ajax call
        $(document)
            .ajaxStart(function () { $loader.show(); })
            .ajaxStop(function () { $loader.hide(); })
            .ajaxError(function () { $loader.hide(); });

        // Check if the size of the window is appropriate for ajax
        var doAjax = ($(window).width() > 768) ? true : false;
        
        // Main Navigation Hover
        $('.nav-main')
            .on('click.subnav', '[data-toggle=dropdown]', function (event) {
                if ($(this).parent().hasClass('open') && $(this).is(event.target)) { return false; }
            })
            .on('mouseenter.subnav', '.dropdown', function () {
                if ($(this).hasClass('open')) { return; }

                $(this).addClass('open');
            })
            .on('mouseleave.subnav', '.dropdown', function () {
                var $this = $(this);

                if (!$this.hasClass('open')) { return; }

                //This will check if an input child has focus. If no then remove class open
                if ($this.find(":input:focus").length === 0) {
                    $this.removeClass('open');
                } else {
                    $this.find(":input:focus").one('blur', function () {
                        $this.trigger('mouseleave.subnav');
                    });
                }
            });

        // Tooltip
        $('body').tooltip({
            selector: '[data-toggle=tooltip]'
        });

        // Confirm Dialog
        $(document).on('click.confirm', '[data-confirm]', function () {
            var $this       = $(this),
                href        = $this.attr('href'),
                callback    = $this.attr('data-confirm-callback'),
                title       = $this.attr('data-confirm') !== '' ? $this.attr('data-confirm') : 'Are you sure?';

            bootbox.confirm(title, function (confirm) {
                if (confirm) {
                    //Check if callback and if it's a function
                    if (callback && $.isFunction(confirmCallback[callback])) {
                        confirmCallback[callback]($this);
                    } else {
                        if (href) {
                            window.location.href = href;
                        } else {
                            // If forms
                            var $form = $this.closest("form");
                            if ($form.size() > 0) {
                                $form.submit();
                            }
                        }
                    }
                }
            });

            return false;
        });

        // Product Quick view Dialog
        $(document).on('click.product-quickview', '.product-quickview', function () { 
            if (doAjax) {
                $.get(this.href,
                    function (data) {
                        // Hide all currently active bootbox dialogs
                        bootbox.hideAll();
                        // Show dialog
                        bootbox.dialog({
                            message : $("#product",data),
                            onEscape: function() {
                                bootbox.hideAll();
                            }
                        });
                    }
                ); 
                return false; 
            }
            return;
        });

        // Product AddtoCard - OnSubmit
        $(document).on('submit.form-product', '.form-product', function () { 
            if (doAjax) {
                var url_action  = $(this).attr("action"),
                    product_id  = $("input[name$='product_id']",this).val();
                    
                $.ajax({type: "POST", data: $(this).serialize(), url: url_action,
                    success: function(data){
                        $(".cart-container").html($(data).html());
                        $.ajax({url:"ajax/addCartMessage", data:{ product_id: product_id },
                            success: function (data) {
                                // Hide all currently active bootbox dialogs
                                bootbox.hideAll();
                                // Show dialog
                                bootbox.dialog({
                                    message : data,
                                    onEscape: function() {
                                        bootbox.hideAll();
                                    }
                                });
                            }
                        });
                    },
                    error: function (e) {
                        console.log('Error.', e);
                    }
                });
                return false;
            }
            return;
        });
            
        $(document).on('change.quantity', 'select:has([data-quantity])', function () { 
            var $productDetails         = $(this).closest("#product-details"),
                $stockInformation       = $("#stock-information", $productDetails),
                $quantityInput          = $("#quantity", $productDetails),
                $btnAddToCart           = $(".btn_add_to_cart", $productDetails);                

            var $current = $(":selected", this); 
            var qty = $current.data("quantity"); 
            
            // Show Out Of Stock OR In Stock
            if (qty == 0) { 
                // Disable button
                $btnAddToCart.attr("disabled", true);

                // Update stock information
                $stockInformation
                    .removeClass("in-stock")
                    .addClass("out-of-stock")
                    .attr("href", "http://schema.org/OutOfStock");

            } else {
                // Active button
                $btnAddToCart.attr("disabled", false);

                // Update Field Quantity if the current value is over Max
                if (parseInt($quantityInput.val()) > parseInt(qty)) {
                    $quantityInput.val(qty);
                }

                // Update stock information
                $stockInformation
                    .removeClass("out-of-stock")
                    .addClass("in-stock")
                    .attr("href", "http://schema.org/InStock");
            }

            // HTML5 number attribute
            $quantityInput.attr("max", qty);

            // Update Prices
            $(".old-price > .price", $productDetails).html($current.data('old-price'));
            $(".special-price > .price, .regular-price > .price", $productDetails).html($current.data('price'));

        });

        // Toolbar
        var $category_products = $ ('#category-products');
        if ($category_products.size() > 0) {
            var $parent = $category_products.parent();

            $parent.on('click.view-mode', '[data-toggle=view]', function () {
                if (($(this).hasClass('btn-grid') && $parent.hasClass('grid')) || ($(this).hasClass('btn-list') && $parent.hasClass('list'))) { return; }

                // Add loader effect
                $loader.show();
                setTimeout(function () { $parent.toggleClass('grid').toggleClass('list'); $loader.hide(); }, 400);

                return false;
            });
        }

        // Login
        var $form_login = $('#form-login');
        if ($form_login.size() > 0) {
            $form_login.on('change.account', ':radio', function () {
                if ($(this).val() === '0') {
                    $('#password', $form_login).val('').prop('disabled', true); // Disabled (new customer)
                }
                else {
                    $('#password', $form_login).prop('disabled', false); // Enabled
                }
            }).find(':radio:checked').trigger('change.account');
        }

        // Mini Newsletter Subscription
        var $form_newsletter = $('#form-newsletter-mini');
        if ($form_newsletter.size() > 0) {
            $form_newsletter.on('submit.newsletter', function () {

                $.ajax({
                    url: $(this).attr('action'),
                    type: $(this).attr('method'),
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function (json) {
                        var $msg = '';
                        if (json.success) {
                            $msg = json.message;
                        } else {
                            $msg = json.message;
                        }
                        bootbox.alert($msg);
                    }
                });

                return false;
            });
        }


        // Forgot Password
        /*
         var $forgot_password = $('.forgot-password', $form_login);
         if($forgot_password.size() > 0) {
         $forgot_password.popover({
         html : true,
         title: 'Forgot Password',
         content: function() {
         return $('#form-forgotpassword').html();
         }
         }).on('click.btn-forgot', function () {

         $('.btn-forgot').click(function () {
         alert('click form');
         return false;
         });

         $('.btn-close').click(function () {
         $forgot_password.popover('hide');
         });

         return false;
         });
         }
         */

        //.Form Filters
        $('#form-filters').each(function () {
            var $form = $(this);

            $form
                .on('change.filter', ':checkbox', function () {
                    $loader.show();
                    $form.submit();
                })
                .find('.group-btn > .btn').addClass('sr-only');
        });

        // Product details Thumbnails
         $(document).on('click.thumbnails', '#product-thumbnails .thumbnail', function () {
                if ($(this).hasClass('active')) { return false; }

                var $productGallery = $(this).closest("#product-gallery"); 
                $('.product-image > img', $productGallery).attr('src',$(this).attr('href'));
                $('.thumbnail', $productGallery).removeClass('active');
                $(this).addClass('active');

                return false;
            });

        // Show Carousel control if needed
        $('#product-gallery').each(function () {
            if ($('.item', this).size() > 1) {
                $('#product-thumbnails', this).carousel({interval: false}).find('.carousel-control').show();
            }
        });

        // Payment Method
        $('#payment-method').each(function () {
            var $label = $('label', this);
            $label.on('change', ':radio', function ()  {
                $label.removeClass('active');
                $label.filter('[for="' + $(this).attr('id') + '"]').addClass('active');
            }).filter(':has(:checked)').addClass('active');
        });

        // Apply validation
        $('#form-contact, #form-register, #form-address').validate({
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block'
        });

        // Toolbar filter
        $('#content').on('change.toolbarfilter', '#limit-top, #sortby-top', function () {
            window.location = $(this).val();
        });

    });

})(jQuery);

