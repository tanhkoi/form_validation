function Validator(options) {
	var formElement = document.querySelector(options.form);

	function validate(inputElement, rule, errorElement) {
		var errorMessage = rule.test(inputElement.value); // goi ham test tuong ung voi tung object duoc tra ve trong rule

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}
	}

	if (formElement) {
		options.rules.forEach((rule) => {
			var inputElement = formElement.querySelector(rule.selector); // lay ra the input co id = "#rule.selector"
			console.log(inputElement);
			if (inputElement) {
				var errorElement = inputElement.parentElement.querySelector(
					options.errorElement
				); // lay ra the span class = "form-message"

				inputElement.onblur = () => {
					validate(inputElement, rule, errorElement);
				};

				inputElement.oninput = () => {
					errorElement.innerText = '';
					inputElement.parentElement.classList.remove('invalid');
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

Validator.isComfirmed = function (selector, getComfirmValue, message) {
	return {
		selector: selector,
		test: function (value) {
			return value === getComfirmValue()
				? undefined
				: message || 'Gía trị nhập vào không chính xác';
		},
	};
};
