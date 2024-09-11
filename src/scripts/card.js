export const cardSelector = '.card'

const cardTemplate = document.querySelector('#card-template').content

/**
 * Возвращает элементы карточки.
 * @param {Element} element Данные карточки.
 * @return {Object} Элементы карточки.
 */
const getCardElements = (element) => ({
  contents: {
    title: element.querySelector('.card__title'),
    image: element.querySelector('.card__image'),
    likeCounter: element.querySelector('.card__like-counter')
  },
  buttons: {
    delete: element.querySelector('.card__delete-button'),
    like: element.querySelector('.card__like-button')
  }
})

/**
 * Функция создания карточки.
 * @param {Object} cardData Данные карточки.
 * @param {number} userId Индентификатор пользователя.
 * @param {Object} callbacks Функции callback.
 * @return {Element} Элемент карточки
 */
export function renderCard ({ likes, link, name, owner }, userId, callbacks) {
  const cardElement = cardTemplate.querySelector(cardSelector).cloneNode(true)
  const { contents, buttons } = getCardElements(cardElement)

  contents.image.src = link
  contents.image.alt = name
  contents.title.textContent = name
  contents.likeCounter.textContent = likes.length

  if (owner._id === userId) {
    buttons.delete.classList.add('card__delete-button_is-active')
    buttons.delete.addEventListener('click', callbacks.deleteCard)
  }

  if (Array.isArray(likes) && likes.some((user) => user._id === userId)) {
    buttons.like.classList.add('card__like-button_is-active')
  }

  buttons.like.addEventListener('click', (event) => callbacks.likeCard(event, contents.likeCounter))
  contents.image.addEventListener('click', callbacks.openGallery)

  return cardElement
}
