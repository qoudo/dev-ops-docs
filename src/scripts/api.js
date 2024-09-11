const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-bac-2',
  headers: {
    authorization: '6bb24505-5d95-4ae1-a6c7-5b193b3df2b1',
    'Content-Type': 'application/json'
  }
}

/**
 * Обрабатывает ошибки.
 * @param {string} error Текст ошибки.
 */
export const handleError = error => console.error(error)

/**
 * Обрабатывает ответ сервера.
 * @param {Object} response Ответ сервера.
 * @return {any} Обработанный ответ.
 */
export const handleResponse = response => {
  if (response.ok) {
    return response.json()
  } else {
    return Promise.reject(new Error(`Ошибка: ${response.status}`))
  }
}

export const RemoteAPI = {
  /**
     * Получение данных карточек.
     * @return {Promise} Промис ответа.
     */
  getCards: () =>
    fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    }).then(handleResponse),

  /**
     * Получение данных пользователя.
     * @return {Promise} Промис ответа.
     */
  getUser: () =>
    fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
    }).then(handleResponse),

  /**
     * Обновление данных пользователя.
     * @param {Object} data Данные пользователя.
     * @return {Promise} Промис ответа.
     */
  updateUser: (data) =>
    fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  /**
     * Добавление карточки.
     * @param {Object} data Данные карточки.
     * @return {Promise} Промис ответа.
     */
  addCard: (data) =>
    fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  /**
     * Удаление карточки.
     * @param {number} id Индентификатор карточки.
     * @return {Promise} Промис ответа.
     */
  deleteCard: (id) =>
    fetch(`${config.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: config.headers
    }).then(handleResponse),

  /**
     * Лайк карточки.
     * @param {number} cardId Индентификатор карточки.
     */
  likeCard: (cardId) => fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(handleResponse),

  /**
     * Дизлайк карточки.
     * @param {number} cardId Индентификатор карточки.
     */
  unLikeCard: (cardId) => fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    headers: config.headers,
    method: 'DELETE'
  }).then(handleResponse),

  /**
     * Обновление аватара.
     * @param {string} url Ссылка на изображение.
     */
  updateAvatar: (url) =>
    fetch(`${config.baseUrl}/users/me/avatar`, {
      headers: config.headers,
      method: 'PATCH',
      body: JSON.stringify({
        avatar: url
      })
    }).then(handleResponse)
}
