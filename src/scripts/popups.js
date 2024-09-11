const currentPopupSelector = 'popup_is-opened'

/**
 * Закрытие popup'а.
 */
export function closePopup () {
  const currentPopupElement = document.querySelector(`.${currentPopupSelector}`)

  currentPopupElement.removeEventListener('mousedown', handleClickOverlay)
  document.removeEventListener('keydown', handleKeyDownEsc)
  currentPopupElement.querySelector('.popup__close').removeEventListener('click', closePopup)

  currentPopupElement.classList.remove(currentPopupSelector)
}

/**
 * Обработчик нажатие кнопки "Esc".
 * @param {KeyboardEvent} event Данные события.
 */
export function handleKeyDownEsc (event) {
  event.key === 'Escape' && closePopup()
}

/**
 * Обработчик клика по Overlay.
 * @param {Event} event Данные события.
 */
export function handleClickOverlay (event) {
  if (event.target.classList.contains(currentPopupSelector)) {
    closePopup(event)
  }
}

/**
 * Открытие popup'а.
 * @param {Element} element Название popup'а.
 */
export function openPopup (element) {
  element.classList.add(currentPopupSelector)

  // Навешиваем обработчики закрытия модального окна
  element.addEventListener('mousedown', handleClickOverlay)
  document.addEventListener('keydown', handleKeyDownEsc)
  element.querySelector('.popup__close').addEventListener('click', closePopup)
}
