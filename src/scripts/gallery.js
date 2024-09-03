const popup = document.querySelector('.popup_type_image')
const img = popup.querySelector('.popup__image')
const caption = popup.querySelector('.popup__caption')

/**
 * Инициализирует галерею.
 */
export function initGallery (data) {
  img.src = data.link
  img.alt = data.name

  caption.innerText = data.name
}
