var Auth = (function(){
    var _refreshListeners = function() {
        $('.deactive').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.deactive').on('click', _Switch);
    };

    var _Switch = function (){
        var active = $('.active'),
            deactive = $('.deactive'),
            active_child = '.'+active.data('child'),
            deactive_child = '.'+deactive.data('child');
        active.removeClass('active').addClass('deactive');
        deactive.removeClass('deactive').addClass('active');
        $(active_child).hide();
        $(deactive_child).show();
        _refreshListeners();
    };


    var init = function () {
        console.log('auth');
        _addListeners();
    };

    return {
       init : init
    };

})();

Auth.init();