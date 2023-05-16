var selectorRules = {};
function Validator(options) {
	// hàm lấy ra outermost parent của thẻ selector
	function getOuterMostParent(childElement, selector) {
		return childElement.closest(selector);
	}
	// hàm lấy ra các rules mà selector có, và thông báo lỗi dựa trên những rule đó
	function validate(inputElement, rule) {
		var errorElement = getOuterMostParent(inputElement, options.formGroup).querySelector(options.errorElement);
		
		var rules = selectorRules[rule.selector];
		var errorMessage;
		for (let i = 0; i < rules.length; i++) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}
		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}
		return !errorMessage;
	}

	var formElement = document.querySelector(options.form);
	if (formElement) {
		// xử lí khi submit form
		formElement.onsubmit = (e) => {
			e.preventDefault();
			// kiểm tra ô input
			var isFormValid = [];
			options.rules.forEach((rule) => {
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				isFormValid.push(isValid);
			});
			// nếu form không có lỗi thì trả về giá trị mà người dùng nhập vào
			if (!isFormValid.includes(false)) {
				if (typeof options.onSubmit === 'function') {
					var enableInputs = formElement.querySelectorAll('[name]');
					var formValues = Array.from(enableInputs).reduce((values, input) => {
						values[input.name] = input.value;
						return values;
					}, {});
					options.onSubmit(formValues);
				}
			}
		};
		
		//
		options.rules.forEach((rule) => {
			// chuyển các rule của một ô input vào object (selectorRules) có value là mảng để xử lí
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}
			//
			var inputElement = formElement.querySelector(rule.selector);
			if (inputElement) {
				// xử lí khi blur
				inputElement.onblur = () => {
					validate(inputElement, rule);
				};
				// xử lí khi nhập
				inputElement.oninput = () => {
					validate(inputElement, rule);
				};
			}
		});
	}
}

Validator.isRequired = function (selector, message) {
	return {
		selector: selector,
		test: function (value) {
			return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
		},
	};
};

Validator.isEmail = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			var validRegex =
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return value.match(validRegex) ? undefined : 'Trường này phải là email';
		},
	};
};

Validator.password = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			var validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
			return value.match(validRegex)
				? undefined
				: '>= 6 ký tự, có in hoa, in thường và ký tự đặc biệt';
		},
	};
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
	return {
		selector: selector,
		test: function (value) {
			return value === getConfirmValue()
				? undefined
				: message || 'Gía trị nhập vào không chính xác';
		},
	};
};
