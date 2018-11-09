feedbackApp = {};

(function (scope) {

    var _isEmpty = function (object) {
        for (var key in object)
            if (object.hasOwnProperty(key)) return false;
        return true;
    };


    var _handleErrors = function (errors) {
        var feedback_block = document.querySelector('.feedback-data');
        feedback_block.classList.add("error");

        var form = document.forms['feedback'];

        for (var name in errors) {
            for (var i = 0; i < errors[name].length; i++) {
                var par = form.elements[name].parentNode;
                par.classList.add('error')
                par.querySelector('.error-text').innerText += errors[name];
            }
        }
    };

    var _removeErrors = function () {
        var feedback_block = document.querySelector('.feedback-data');
        feedback_block.classList.remove("error");

        var div_fields = feedback_block.querySelectorAll('.error');
        for (var i = 0; i < div_fields.length; i++) {
            div_fields[i].classList.remove("error")
            div_fields[i].querySelector('.error-text').innerText = ''
        }
    };

    var _showMessage = function (message, message_type) {
        var mes = document.querySelector('#message');
        mes.innerText = message;
        mes.classList.add(message_type);
    };

    var _hideMessage = function () {
        var mes = document.querySelector('#message');
        mes.innerText = '';
        mes.classList = '';
    };


    var _validatedData = function () {
        var required = ['name', 'email', 'message'];
        var error_fields = {};
        var form = document.forms['feedback'];
        var fields = {
            'name': form.elements['name'].value,
            'email': form.elements['email'].value,
            'phone': form.elements['phone'].value,
            'message': form.elements['message'].value
        };
        for (var i = 0; i < required.length; i++) {
            if (fields[required[i]] === '') {
                if (!error_fields[required[i]]) {
                    error_fields[required[i]] = ['Обязательное поле'];
                }
            }
        }
        if (!error_fields['email'] && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields['email'])) {
            error_fields['email'] = ['Некорректный адрес почты']
        }

        if (!_isEmpty(error_fields)) {
            _handleErrors(error_fields);
            return false;
        }
        return fields;

    };

    scope.send = function () {
        _removeErrors();
        _hideMessage();
        var data = _validatedData();

        if (data) {
            document.querySelector('.feedback-data button').disabled = true;
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType("application/json");
            var b_part = [];
            for (var i in data) {
                b_part.push(i + '=' + encodeURIComponent(data[i]))
            }
            var body = b_part.join('&');

            xhr.open("POST", 'feedback.py', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                document.querySelector('.feedback-data button').disabled = false;
                if (xhr.readyState !== 4) return;

                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {

                    var response = JSON.parse(xhr.responseText);
                    if (response.status === 'success') {
                        _showMessage(response.message, 'success');
                    } else if (!_isEmpty(response.error_fields)) {
                        _handleErrors(response.error_fields);
                    } else {
                        _showMessage(response.message, 'error');
                    }
                }

            };

            xhr.send(body);
        }


    };

})(feedbackApp);
