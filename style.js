function Validator(options){
    var selectorRule = {};
    function invalid(inputElement,rule) // hàm xử lý in đỏ 
    {
                    var errMessage;
                    var errElement=inputElement.parentElement.querySelector(options.errorSelector)
                    //lấy ra các rule của selector
                    var rules = selectorRule[rule.selector];
                    //lập qua từng rule và kiểm tra
                    // nếu có lỗi dừng việc kiểm tra
                    for(var i=0;i<rules.length;++i)
                    {
                        errMessage =rules[i](inputElement.value)
                        if(errMessage) break;
                    }

                    if(errMessage)
                    {
                        errElement.innerText=errMessage;
                        inputElement.parentElement.classList.add('invalid')
                    }else
                    {
                        errElement.innerText='';
                        inputElement.parentElement.classList.remove('invalid')
                    }
                    return ! errMessage;
    }
    // lấy element của form cần vailidator 
    var formElement = document.querySelector(options.form)
    if(formElement){

        formElement.onsubmit = function (e) {
            e.preventDefault();
            // lặp và valid 

                 var isFormValid = true;

                 // Lặp qua từng rules và validate
                 options.rules.forEach(function (rule) {
                     var inputElement = formElement.querySelector(rule.selector);
                     var isValid = invalid(inputElement, rule);
                     if (!isValid) {
                         isFormValid = false;
                     }
            });
            if(isFormValid){
                console.log('không có lỗi')
            }else{
                console.log('có lỗi')
            }
            
        }

        // xử lý lập qua mỗi rule nhận sự kiện ...
        options.rules.forEach(function(rule){
            // lưu lại các rule cho mỗi input
            if(Array.isArray(selectorRule [rule.selector] )){
                selectorRule [rule.selector].push(rule.test);
            }else {
                selectorRule [rule.selector] = [rule.test];
            }

            var inputElement= formElement.querySelector(rule.selector)
            if(inputElement)
            {
                // xử lý trường hợp blur khỏi input
                inputElement.onblur=function(){
                    invalid(inputElement,rule)
                }

                // xử lý trường hợp nhập vào input
                inputElement.oninput =function()
                {
                var errElement=inputElement.parentElement.querySelector(options.errorSelector)
                errElement.innerText='';
                inputElement.parentElement.classList.remove('invalid')
                }

            }
        });
    }

}
Validator.isRequired =function(selector,message){
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message ||'Vui lòng nhập trường hợp này'

        }
    }
}
Validator.isEmail =function(selector,message)
{
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message|| 'Vui lòng nhập đúng email';
        }

    }
}
Validator.isMinLength =function(selector, min,message){
    return {
        selector: selector,
        test: function (value) {
            return value.length >=min ? undefined : message ||`Vui lòng nhập tối thiểu ${min} kí tự`

        }
    }
}
Validator.isConfirmed =function(selector,getValue,message)
{
    return {
        selector: selector,
        test: function (value) {
            return value === getValue() ? undefined:message||'Giá trị nhập vào không đúng'

        }

    }
}
