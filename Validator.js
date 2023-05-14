var selectorRules = {};
function Validator(options) {
	function validate(inputElement, rule, errorElement) {
		var errorMessage;
		// lay ra cac rules cua selector (#email, #full-name,...)
		var rules = selectorRules[rule.selector];
		// lap qua tung rule va kiem tra
		// neu co loi thi dung kiem tra
		for (let i = 0; i < rules.length; i++) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}
		// xu li thong bao loi
		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}

		return !errorMessage;
	}

	// lay element cua form can validate
	var formElement = document.querySelector(options.form);

	if (formElement) {
		// khi submit form
		formElement.onsubmit = (e) => {
			e.preventDefault();
			var isFormValid = [];
			// lap qua tung rule va validate
			options.rules.forEach((rule) => {
				var inputElement = formElement.querySelector(rule.selector);
				var errorElement = inputElement.parentElement.querySelector(
					options.errorElement
				);
				var isValid = validate(inputElement, rule, errorElement);
				isFormValid.push(isValid);
			});

			if (!isFormValid.includes(false)) {
				if (typeof options.onSubmit === 'function') {
					var enableInputs = formElement.querySelectorAll('[name');
					console.log(enableInputs);
					console.log(Array.from(enableInputs)[0].name);
					var formValues = Array.from(enableInputs).reduce(function (
						values,
						input
					) {
						return (values[input.name] = input.value) && values;
					},
					{});
					options.onSubmit(formValues);
				}
			}
		};

		// lap qua moi rule va xu li
		options.rules.forEach((rule) => {
			// luu lai cac rules cho moi input
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}
			// lay the input co id = rule.selector
			var inputElement = formElement.querySelector(rule.selector);
			// lay ra the span class = options.errorElement
			var errorElement = inputElement.parentElement.querySelector(
				options.errorElement
			);

			if (inputElement) {
				// xu li thong bao khi blur ra ngoai
				inputElement.onblur = () => {
					validate(inputElement, rule, errorElement);
				};
				// xu li thong bao khi nhap du lieu vao the input
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
