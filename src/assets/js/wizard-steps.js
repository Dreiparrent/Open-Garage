/*=========================================================================================
    File Name: wizard-steps.js
    Description: wizard steps page specific js
    ----------------------------------------------------------------------------------------
    Item Name: Apex - Responsive Admin Theme
    Version: 1.0
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// Wizard tabs with icons setup
$(document).ready( function(){
    var setStyle;
    $(".icons-tab-steps").steps({
        headerTag: "h6",
        bodyTag: "fieldset",
        transitionEffect: "fade",
        titleTemplate: '<span class="step">#index#</span> #title#',
        preloadContent: true,
        labels: {
            finish: 'Submit'
        },
        onInit: function(event, currentIndex) {
            var evt = document.createEvent('Event');
            evt.initEvent('spanStart', true, true);
            document.dispatchEvent(evt);

            var evt = document.createEvent('Event');
            evt.initEvent('spanHover', true, true);

            var $skillSpan = $('#skillSpan');
            $skillSpan.hover(() => {
                document.dispatchEvent(evt);
            }, () => {
                document.dispatchEvent(evt);
            })
            /*    
            $skillSpan.hover(() => {
                document.dispatchEvent(evt);
                $skillSpan = $('#skillSpan');
                var $popover = $('.bs-popover-bottom');                
                const locTop = $skillSpan.offset().top + $skillSpan.height();
                const locLeft = $skillSpan.offset().left - 12;
                setStyle = `
                    <style>
                        .bs-popover-bottom {
                            top: ${locTop}px !important;
                            left: ${locLeft}px !important;
                        }
                    </style>
                `;
                $(document.head).append(setStyle);
            }, () => {
                document.dispatchEvent(evt);
                $(document.head).remove(`:contains(${setStyle})`);
            });
            */
        },
        onFinished: function (event, currentIndex) {
            alert("Form submitted.");
        }
    });
 });