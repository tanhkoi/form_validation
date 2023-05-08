function Validator(options) {
	var formElement = document.querySelector(options.form);
	function validate(inputElement, rule, errorElement) {
		var errorMessage = rule.test(inputElement.value);

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
			var inputElement = formElement.querySelector(rule.selector);
			console.log(inputElement);
			if (inputElement) {
				var errorElement = inputElement.parentElement.querySelector(
					options.errorElement
				);

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

Validator.isRequired = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return value.trim() ? undefined : 'Vui lòng nhập trường này';
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
			var validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			return value.match(validRegex)
				? undefined
				: 'It must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter';
		},
	};
};
