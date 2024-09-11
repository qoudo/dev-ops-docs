import { cardSelector, renderCard } from './scripts/card'
import { closePopup, openPopup } from './scripts/popups'
import { initEditForm, addProfile, profileElements } from './scripts/profile'
import { initGallery } from './scripts/gallery'
import { enableValidation, clearValidation } from './scripts/validation'
import './styles/index.css'
import { handleError, RemoteAPI } from './scripts/api'

const content = document.querySelector('.content')
const cardList = content.querySelector('.places__list')
export const popupKeys = {
  edit: 'edit',
  addCard: 'addCard',
  gallery: 'gallery',
  deleteCard: 'deleteCard',
  updateAvatar: 'updateAvatar'
}
const forms = {
  edit: document.forms['edit-profile'],
  addCard: document.forms['new-place'],
  updateAvatar: document.forms['update-avatar']
}
const buttons = [
  { edit: content.querySelector('.profile__edit-button'), name: popupKeys.edit },
  { addCard: content.querySelector('.profile__add-button'), name: popupKeys.addCard },
  { updateAvatar: content.querySelector('.profile__image-button'), name: popupKeys.updateAvatar }
]
const popups = {
  edit: document.querySelector('.popup_type_edit'),
  addCard: document.querySelector('.popup_type_new-card'),
  gallery: document.querySelector('.popup_type_image'),
  deleteCard: document.querySelector('.popup_type_delete-card'),
  updateAvatar: document.querySelector('.popup_type_update-avatar')
}
const popupConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

const statuses = {
  request: 'request',
  success: 'success'
}

let cardToDeleteId, cardToDelete


/**
 * Переключатель лоадера.
 * @param {HTMLFormElement} form Форма.
 * @param {string} status Статус.
 */
const toggleLoader = (form, status) => {
  const button = form.querySelector(popupConfig.submitButtonSelector)

  switch (status) {
    case statuses.request:
      button.textContent = 'Сохранение...'
      break
    case statuses.success:
      button.textContent = 'Сохранить'
  }
}

/**
 * Инициализирует удаления карточки.
 * @param {CloseEvent} event Cобытие клика.
 * @param {number} cardId Индентификатор карточки.
 */
function initDeleteCard (event, cardId) {
  cardToDeleteId = cardId
  cardToDelete = event.target.closest(cardSelector)
  openPopup(popups.deleteCard)
}

/**
 * Обработчик удаления карточки.
 */
function handleDeleteCard () {
  RemoteAPI.deleteCard(cardToDeleteId)
      .then(() => {
        cardToDelete.remove()
        closePopup()
      })
      .catch(handleError)
}

/**
 * Обработчик кнопки "нравится".
 * @param {CloseEvent} event Cобытие клика.
 * @param {number} cardId Индентификатор карточки.
 * @param {HTMLSpanElement} likeCounter Счетчик лайков.
 */
function handleToggleLike (event, cardId, likeCounter) {
  const likeMethod = event.target.classList.contains('card__like-button_is-active')
      ? RemoteAPI.unLikeCard
      : RemoteAPI.likeCard;

  likeMethod(cardId)
      .then((data) => {
        event.target.classList.toggle('card__like-button_is-active')
        likeCounter.textContent = data.likes.length
      })
      .catch(handleError);
}

/**
 * Обработчик открытия popup'а.
 * @param {string} name Название popup'а.
 * @param {object} [data] Данные popup'а.
 */
function handleOpenPopup (name, data) {
  switch (name) {
    case popupKeys.edit:
      initEditForm(forms.edit)
      break
    case popupKeys.gallery:
      initGallery(data)
      break
  }

  clearValidation(popupConfig, popups[name])
  openPopup(popups[name])
}

/**
 * Обработчик добавление карточки.
 * @param {Event} event Объект события.
 */
function handleAddCard (event) {
  event.preventDefault()

  toggleLoader(forms.addCard, statuses.request)
  RemoteAPI.addCard({
    name: forms.addCard['place-name'].value,
    link: forms.addCard.link.value
  })
    .then((data) => {
      cardList.prepend(getCardElement(data, data.owner._id))
      closePopup()
      forms.addCard.reset()
    })
    .catch(handleError)
    .finally(() => toggleLoader(forms.addCard, statuses.success))
}

/**
 * Обработчик обновления данных пользователя.
 * @param {Event} event Объект события.
 */
function handleUpdateUser (event) {
  event.preventDefault()
  toggleLoader(forms.edit, statuses.request)

  RemoteAPI.updateUser({
    name: forms.edit.name.value,
    about: forms.edit.description.value
  })
    .then((data) => {
      addProfile(data)
      closePopup()
    })
    .catch(handleError)
    .finally(() => toggleLoader(forms.edit, statuses.success))
}

/**
 * Обработчик обновление аватара.
 * @param {Event} event Объект события.
 */
function handleUpdateAvatar (event) {
  const url = forms.updateAvatar.avatar.value
  event.preventDefault()
  toggleLoader(forms.updateAvatar, statuses.request)

  RemoteAPI.updateAvatar(url)
    .then((data) => {
      profileElements.avatar.style.backgroundImage = `url(${data.avatar})`
      closePopup()
      forms.updateAvatar.reset()
    })
    .catch(handleError)
    .finally(() => toggleLoader(forms.updateAvatar, statuses.success))
}

/**
 * Возвращает элемент карточки.
 * @param {object} data Данные карточки.
 * @param {number} userId Индентификатор пользователя.
 */
const getCardElement = (data, userId) => renderCard(data, userId, {
  deleteCard: (event) => initDeleteCard(event, data._id),
  likeCard: (event, likeCounter) => handleToggleLike(event, data._id, likeCounter),
  openGallery: () => handleOpenPopup(popupKeys.gallery, data)
})

// Открытие попапов
buttons.forEach(({ name, ...item }) => item[name].addEventListener('click', () => handleOpenPopup(name)))
// Слушаем событие отправки формы "Редактировать профиль"
forms.edit.addEventListener('submit', handleUpdateUser)
// Слушаем событие отправки формы "Добавить карточку"
forms.addCard.addEventListener('submit', handleAddCard)
// Слушаем событие отправки формы "Обновить аватар"
forms.updateAvatar.addEventListener('submit', handleUpdateAvatar)
// Слушаем событие подтверждения удаления карточки
popups.deleteCard.querySelector(popupConfig.submitButtonSelector).addEventListener('click', handleDeleteCard)

// Запускаем валидацию форм
enableValidation(popupConfig)

// Инициализируем загрузку данных пользотвателя и карточек
Promise.all([RemoteAPI.getUser(), RemoteAPI.getCards()])
  .then(([{ _id: id, ...user }, cards]) => {
    // Инициализация пользователя
    addProfile(user)
    // Выводим карточки на страницу
    cardList.append(...cards.map((item) => getCardElement(item, id)))
  })
  .catch(handleError)
