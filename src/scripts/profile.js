export const profileElements = {
  name: document.querySelector('.profile__title'),
  description: document.querySelector('.profile__description'),
  avatar: document.querySelector('.profile__image')
}

export const addProfile = ({ name, about, avatar }) => {
  profileElements.name.textContent = name
  profileElements.description.textContent = about
  profileElements.avatar.style.backgroundImage = `url(${avatar})`
}

/**
 * Инициализирует форму редактирования профиля.
 * @param {Element} profileForm Форма профиля.
 */
export function initEditForm (profileForm) {
  profileForm.name.value = profileElements.name.textContent
  profileForm.description.value = profileElements.description.textContent
}
