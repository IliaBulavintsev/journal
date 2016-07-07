/**
 * Created by ilia on 12.04.16.
 */
var csrfModule = (function() {
    var _csrfToken = $.cookie('csrftoken');

    var _setUp = function() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if(!_csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", _csrfToken);
                }
            }
        });
    };

    var _csrfSafeMethod = function(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    return {
        init: function() {
            _setUp();
        }
    }
})();

var Personal = (function(){
    var _refreshListeners = function() {
        $('.btn_correct_record').off();
        $('.btn_remove_record').off();
        $('.btn_submit_remove_record ').off();
        $('.cancel_remove_record').off();
        $('.btn_cancel_send_record').off();
        $('.btn_add_record').off();
        $('.btn_cancel_save_record').off();
        $('.btn_save_record').off();
        $('.change_goal').off();
        $('.btn_send_record').off();
        $('.button_submit_register').off();
        _addListeners();
    };

    var _addListeners = function() {
        $('.btn_correct_record').on('click', _correct);
        $('.btn_remove_record').on('click', _remove);
        $('.btn_submit_remove_record ').on('click', _submitRemove);
        $('.cancel_remove_record').on('click', _cancelRemove);
        $('.btn_cancel_send_record').on('click', _cancelEditRecord);
        $('.btn_add_record').on('click', _addRecordForm);
        $('.btn_cancel_save_record').on('click', _cancelSaveRecord);
        $('.btn_save_record').on('click', _saveRecord);
        $('.change_goal').on('click', _changeGoal);
        $('.btn_send_record').on('click', _changeRecord);
        $('.button_submit_register').on('click', _register);
    };

    function validateEmail(field,alerttxt){

            var apos = field.indexOf("@");
            var dotpos = field.lastIndexOf(".");
            if (apos<1||dotpos-apos<2){
                return false;
            }
            else {
                return true;
            }
    }

    function validateUsername(fld) {
        var error = '',
            illegalChars = /\W/; // allow letters, numbers, and underscores
        if (fld == '') {
            error += "Username пустое.\n";
        } else if ((fld.length < 5) || (fld.length > 15)) {
            error += "Username от 5 до 15 символов.\n";
        } else if (illegalChars.test(fld)) {
            error += "Username только буквы, цифры, нижн.подчеркивание.\n";
        } else {

        }
        return error;
    }

    function validatePassword(fld, fld2) {
        var error = "";
        var illegalChars = /[\W_]/; // allow only letters and numbers

        if (fld == "") {
            error += "Введи пароль.\n";
        } else if ((fld.length < 6) || (fld.length > 15)) {
            error += "Пароль от 7 до 15 символов. \n";
        } else if (illegalChars.test(fld)) {
            error += "Пароль только цифры и буквы.\n";
        } else if (!((fld.search(/(a-z)+/)) && (fld.search(/(0-9)+/)))) {
            error += "Пароль содержит болле одного числа.\n";
        } else if (fld != fld2){
            error += "Повтори пароль правильно"
        }
       return error;
    }

    function emailsend(){
        return '<div class="center-block content_block">'+
                    '<div class="alert alert-success" role="alert">'+
                        'Регистрация прошла удачно! Проверь почту для подтверждения email!'+
                    '</div>'+
                '</div>'
    }

    var _register = function(e){
        e.preventDefault();
        var data = {
            username : $('#username').val(),
            email: $('#email').val(),
            password:$('#password').val(),
            repeat_pass: $('#password_repeat').val()
        };
        console.log(data);
        var email = validateEmail(data.email, 'email');
        var user = validateUsername(data.username);
        var password = validatePassword(data.password, data.repeat_pass);
        if (!email){
            user = 'Введи корректный email! '+ user;
        }
        if (password){
            user += password;
        }
        if(user){
            _push(0, user);
        } else {
            $.ajax({
                url : "../registration/",
                type : "POST",
                data : data,
                success : function(json){
                    if (json.status == 'ok'){
                        _push(1);
                        $('.auth_form').replaceWith(emailsend());
                    } else {
                        _push(0, json.error);
                    }
                },
                error : function() {
                    _push(0,'Ошибка сервера!');
                }
            })
        }
    };

    var buttnMarkup = function(){
      return '<button type="button" class="btn btn-warning btn-xs btn_correct_record new_button">' +
                '<span class="glyphicon glyphicon-pencil span_xs"></span> ' +
            '</button><button type="button" class="btn btn-danger btn-xs btn_remove_record new_button"><span class="glyphicon glyphicon-remove span_xs"></span></button>'
    };

    var buttnCorrectMarkup = function(){
      return '<div class="correct_option">'+
                '<button type="button" class="btn btn-success btn-xs btn_send_record new_button">'+
                    '<span class="glyphicon glyphicon-ok span_xs"></span>'+
                '</button>'+
                '<button type="button" class="btn btn-warning btn-xs btn_cancel_send_record new_button">'+
                                            'Отмена'+
                '</button>'+
              '</div>'
    };

    var _changeRecord = function(){
        console.log('ChangeRecord');
        var tr = $(this).parents().eq(2),
            panel = $(this).parents().eq(5),
            span_word = $(panel).children('.panel-footer').find('.result_word'),
            span_result = $(panel).children('.panel-footer').find('.result'),
            pk_record = $(tr).data('record'),
            input_score = $('.input_set_score'),
            input_description = $('.input_set_description'),
            input_score_pre = parseInt(input_score.data('pre')),
            input_description_pre = input_description.data('pre'),
            input_score_val = parseInt($(input_score).val()),
            input_desc_val = $(input_description).val();
        if(input_desc_val == '' || input_score_val < 0 || isNaN(input_score_val)){
            _push(0, 'Введи корректные данные!');
        } else {
            var data = {
                            desc : input_desc_val,
                            score : input_score_val,
                            pk : pk_record
                        } ;
            console.log(panel);
            $.ajax({
                url : "../changerecord/",
                type : "POST",
                data : data,
                success : function(json){
                    if (json.status == 'ok'){
                        _push(1);
                        var sign = json.sign,
                            result = json.result;
                        if(sign){
                            $(span_word).text('недобор');
                        } else {
                            $(span_word).text('перебор');
                        }
                        $(span_result).text(result);
                        input_score.replaceWith('<p class="text-center"><span class="score">'+$(input_score).val()+'</span></p>');
                        input_description.replaceWith('<span class="description">'+$(input_description).val()+'</span>');
                        $('.correct_option').hide();
                        $('.btn_correct_record').show();
                        $('.btn_remove_record').show();
                        $('.btn_add_record').show();
                    } else {
                        input_score.val(input_score_pre);
                        input_description.val(input_description_pre);
                        _push(0,'Ошибка в обработке!');
                    }
                },
                error : function() {
                    input_score.val(input_score_pre);
                    input_description.val(input_description_pre);
                    _push(0,'Ошибка сервера!');
                }
            });
        }
        _refreshListeners();
    };

    var _changeGoal = function () {
        console.log('change_goal');
        var panel = $(this).parents().eq(5),
            parent = $(this).parents().eq(0),
            input = $(parent).prev(),
            input_value = parseInt($(input).val()),
            pk = $(panel).data('pk'),
            span_word = $(panel).children('.panel-footer').find('.result_word'),
            span_result = $(panel).children('.panel-footer').find('.result');
        console.log(input_value);
        if (input_value < 0 || isNaN(input_value)){
            input.val($(input).data('val'));
            _push(0,'Введи корректные данные!');
        } else {
            var data = {
                            val : input_value,
                            pk : pk
                        } ;
            console.log(data);
            $.ajax({
                url : "../changegoal/",
                type : "POST",
                data : data,
                success : function(json){
                    if (json.status == 'ok'){
                        _push(1);
                        var sign = json.sign,
                            result = json.result,
                            val = json.val;
                        if(sign){
                            $(span_word).text('недобор');
                        } else {
                            $(span_word).text('перебор');
                        }
                        $(span_result).text(result);
                        $(input).val(val);
                        $(input).data('val', val);
                    } else {
                        input.val($(input).data('val'));
                        _push(0,'Ошибка в обработке!');
                    }
                },
                error : function() {
                    input.val($(input).data('val'));
                    _push(0,'Ошибка сервера!');
                }
            });
        }
    };

    var _saveRecord = function(event){
        event.preventDefault();
        console.log('save_to_server');
        var input_score = $('.input_set_score'),
            input_description = $('.input_set_description'),
            td_input_score = $(input_score).parent(),
            td_input_description = $(input_description).parent(),
            panel =$(this).closest('.panel'),
            span_word = $(panel).children('.panel-footer').find('.result_word'),
            span_result = $(panel).children('.panel-footer').find('.result'),
            date =$(panel).data('pk'),
            description = $(input_description).val(),
            input_score_val = parseInt($(input_score).val()),
            td = $(input_score).parent().next().next(),
            td_corr = $(input_score).parent().next(),
            tr = $(input_score).parents().eq(1);
        if (input_score_val < 0 || !description || isNaN(input_score_val)){
            _push(0,'Введи корректные данные!');
        } else {
            var data = {
                            description : description,
                            score : input_score_val,
                            date_pk : date
                        } ;
            console.log(data);
            $.ajax({
                url : "../addrecord/",
                type : "POST",
                data : data,
                success : function(json){
                    if (json.status == 'ok'){
                        var sign = json.sign,
                            result = json.result;
                        if(sign){
                            $(span_word).text('недобор');
                        } else {
                            $(span_word).text('перебор');
                        }
                        $(span_result).text(result);
                        input_score.replaceWith('<p class="text-center"><span class="score">'+$(input_score).val()+'</span></p>');
                        input_description.replaceWith('<span class="description">'+$(input_description).val()+'</span>');
                        $(td).html(buttnMarkup());
                        $(td_corr).addClass('option');
                        $(td_corr).html(buttnCorrectMarkup());
                        $(tr).removeClass('save_record');
                        $(tr).attr('data-record', json.pk);
                        $(td_input_description).addClass('description');
                        $(td_input_score).addClass('score');
                        $('.correct_option').hide();
                        $('.btn_correct_record').show();
                        $('.btn_remove_record').show();
                        $('.btn_add_record').show();
                        _refreshListeners();
                        _push(1);

                    } else {
                        _push(0,'Ошибка в обработке!');
                    }
                },
                error : function() {
                    _push(0,'Ошибка сервера!');
                }
            })

        }
    };

    var _cancelSaveRecord = function(){
        $('.save_record').remove();
        $('.btn_save_record').hide();
        $('.btn_cancel_save_record').hide();
        $('.btn_correct_record').show();
        $('.btn_remove_record').show();
        $('.btn_add_record').show();

    };

    var _formToAdd = function(index){
        console.log('markup');
        var markup = '<tr class="save_record">' +
            '<td class="loop">'+index+'</td>' +
            '<td><input type="text" class="form-control input_set_description" name="set_description" placeholder="Описание"></td>' +
            '<td><input type="number" class="form-control input_set_score" name="set_score" placeholder="Каллории"></td>' +
            '<td>' +
                '<button type="button" class="btn btn-success btn-xs btn_save_record correct_option">Сохранить</button>' +
            '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-warning btn-xs btn_cancel_save_record correct_option">Отмена</button>'+
            '</td>' +
            '</tr>';
        return markup;
    };

    var _addRecordForm = function () {
        //console.log($(this).closest('.panel'));
        var panel = $(this).closest('.panel'),
            table = $(panel).children('.table'),
            tbody = $(table).children('tbody'),
            last = $(tbody).children().last(),
            index = parseInt($(last).children().first().text());
        console.log(index);
        if (isNaN(index)){
            //console.log('clear');
            $(tbody).html(_formToAdd(1));
            //$(_formToAdd(1)).insertAfter(tbody);
        } else {
            $(_formToAdd(index+1)).insertAfter(last);
        }
        $('.btn_correct_record').hide();
        $('.btn_remove_record').hide();
        $('.btn_add_record').hide();
        _refreshListeners();

    };

    var _remove = function(){
        console.log('remove');
        var value = $(this).closest('tr').data('record');
        console.log(value);
        $('#record_del').val(value);
        $('.form_div').bPopup();
        _refreshListeners();
    };

    var _push = function(status, mess){
        var push = $('.push');
        if (status == 1){
            push
            push.removeClass('alert-danger').addClass('alert-success').width('100px');
            push.children().html('Успех!');
            push.show("slow").delay(2000).hide("slow");
        } else {
            push.removeClass('alert-success').addClass('alert-danger').width('200px');
            push.children().html(mess);
            push.show("slow").delay(2000).hide("slow");
        }
    };

    var _cancelRemove = function(){
        $('.form_div').bPopup().close();
        _refreshListeners();
    };

    var _submitRemove = function(){
        var to_del = $('#record_del').val();
        var del = $('tr[data-record='+to_del+']'),
            tbody = del.closest('tbody'),
            panel = $(tbody.parent('table')).next(),
            p = $(panel).children(),
            span_result = $(p).children('.result'),
            span_word = $(p).children('.result_word');
        var data = {
                        pk : to_del

                    } ;
        $.ajax({
                url : "../delrecord/",
                type : "POST",
                data : data,
                success : function(json){
                    if (json.status == 'ok'){
                        _push(1);
                        del.remove();
                        tbody.children('tr').each(function( index ) {
                            var select = $(this).children('.loop');
                            select.html(index+1);
                        });
                        var sign = json.sign,
                            result = json.result;
                        if(sign){
                            $(span_word).text('недобор');
                        } else {
                            $(span_word).text('перебор');
                        }
                        $(span_result).text(result);
                        $('.form_div').bPopup().close();
                        _refreshListeners();
                    } else {
                        _push(0,'Ошибка в обработке!');
                        $('.form_div').bPopup().close();
                        _refreshListeners();
                    }
                },
                error : function() {
                    _push(0,'Ошибка сервера!');
                    $('.form_div').bPopup().close();
                    _refreshListeners();
                }
            });
        //console.log(del);
        //console.log(tbody);

    };

    var _correct = function(){
        console.log('correct');
        var tr = $(this).parents().eq(1),
            //tr = $(this).closest('tr'),
            score = tr.children('.score').children('p'),
            text = tr.children('.description').children('span'),
            score_val = parseInt(score.children('span').text()),
            text_val = text.text();
        console.log(text_val);
        console.log(score_val);
        score.replaceWith('<input type="number" class="form-control input_set_score" data-pre="'+score_val+'" name="set_score" value='+score_val+'>');
        text.replaceWith('<input type="text" class="form-control input_set_description" name="set_description" value="'+text_val+'">');
        $('.input_set_description').data("pre", text_val);
        $('.btn_correct_record').hide();
        $('.btn_remove_record').hide();
        $('.btn_add_record').hide();
        tr.children('.option').children('.correct_option').show();
        _refreshListeners();
    };

    var _cancelEditRecord = function(){
        var input_score = $('.input_set_score'),
            input_set_description = $('.input_set_description'),
            input_score_pre = parseInt(input_score.data('pre')),
            input_description_pre = input_set_description.data('pre');
        console.log(input_description_pre);
        input_score.replaceWith('<p class="text-center"><span class="score">'+input_score_pre+'</span></p>');
        input_set_description.replaceWith('<span class="description">'+input_description_pre+'</span>');
        $('.correct_option').hide();
        $('.btn_correct_record').show();
        $('.btn_remove_record').show();
        $('.btn_add_record').show();
        console.log('cancel edit');
        _refreshListeners();
    };

    var init = function () {
        console.log('personal');
        _addListeners();
    };

    return {
       init : init
    };

})();

Personal.init();
csrfModule.init();