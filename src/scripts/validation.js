/**
 * Проверяет поле на валидность.
 * @param {Array<HTMLInputElement>} inputList Коллекция полей.
 */
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

/**
 * Переключает состояние кнопки активная/неактивная.
 * @param {Array<HTMLInputElement>} inputList Коллекция полей.
 * @param {HTMLButtonElement} buttonElement Кнопка.
 * @param {object} config Конфигурация.
 */
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true
    buttonElement.classList.add(config.inactiveButtonClass)
  } else {
    buttonElement.disabled = false
    buttonElement.classList.remove(config.inactiveButtonClass)
  }
}

/**
 * Выводит сообщение об ошибке.
 * @param {HTMLFormElement} formElement Форма.
 * @param {HTMLInputElement} inputElement Инпут.
 * @param {string} errorMessage Сообщение.
 * @param {object} config Конфигурация.
 */
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.add(config.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(config.errorClass)
}

/**
 * Прятает сообщение об ошибке.
 * @param {HTMLFormElement} formElement Форма.
 * @param {HTMLInputElement} inputElement Инпут.
 * @param {object} config Конфигурация.
 */
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(config.inputErrorClass)
  errorElement.classList.remove(config.errorClass)
  errorElement.textContent = ''
}

/**
 * Проверяет поле на валидность.
 * @param {HTMLFormElement} formElement Форма.
 * @param {HTMLInputElement} inputElement Инпут.
 * @param {object} config Конфигурация.
 */
const checkInputValidity = (formElement, inputElement, config) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
    inputElement.setCustomValidity('')
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config)
  } else {
    hideInputError(formElement, inputElement, config)
  }
}

/**
 * Устанавливает слушателя событий.
 * @param {HTMLFormElement} formElement Форма.
 * @param {object} config Конфигурация.
 */
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector))
  const buttonElement = formElement.querySelector(config.submitButtonSelector)
  toggleButtonState(inputList, buttonElement, config)
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, config)
      toggleButtonState(inputList, buttonElement, config)
    })
  })
}

/**
 * Отчищает ошибки форм.
 * @param {object} config Конфигурация.
 * @param {HTMLDivElement} popup Попап.
 */
export const clearValidation = (
  config,
  popup
) => {
  const form = popup.querySelector(config.formSelector)
  const inputList = [...form.querySelectorAll(config.inputSelector)]
  const submitButtonElement = form.querySelector(config.submitButtonSelector)

    inputList.forEach((inputElement) => {
    hideInputError(form, inputElement, config)
    form.reset()
    toggleButtonState(inputList, submitButtonElement, config)
  })
}

/**
 * Включает валидацию полей форм.
 * @param {object} config Конфигурация.
 */
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector))
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault()
    })
    setEventListeners(formElement, config)
  })
}
