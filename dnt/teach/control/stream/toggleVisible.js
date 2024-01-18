import { khtLog } from 'https://cdn.jsdelivr.net/gh/anleyn/khtplugin@main/lib/core/libLog.min.js'

/**
 * @fileoverview Модуль для переключения видимости элементов на странице
 */

/**
 * Переключает видимость оранжевого уведомления вверху.
 * @param {boolean} isVisible - Флаг.
 */
function toggleTopNotification (isVisible) {
  const selector = '.topNotification'
  khtLog(`Поиск верхнего уведомления: ${selector}.`, 'debug')
  const $element = document.querySelector(selector)
  if (!$element) {
    khtLog(`Элемент ${selector} не найден.`, 'debug')
    return
  }
  $element.style.display = isVisible ? 'block' : 'none'
  khtLog(`Верхнее уведомление ${isVisible ? 'показано' : 'скрыто'}.`, 'debug')
}

/**
 * Переключает видимость по ID тренингов.
 * @param {boolean} isVisible - Флаг.
 */
function toggleTrainingRows (isVisible) {
  const selector = 'tr[data-training-id="532958946"], tr[data-training-id="644676333"]'
  khtLog(`Поиск элементов таблицы с ID тренингов: ${selector}.`, 'debug')
  const $elements = document.querySelectorAll(selector)
  if (!$elements.length) {
    khtLog(`Элементы таблицы с ID тренингов ${selector} не найдены.`, 'debug')
    return
  }
  $elements.forEach(element => {
    element.style.display = isVisible ? 'table-row' : 'none'
  })
  khtLog(`Элементы таблицы с ID тренингов ${isVisible ? 'показаны' : 'скрыты'}.`, 'debug')
}

/**
 * Обновляет значение видимости в localStorage.
 * @param {boolean} isVisible - Текущее состояние видимости.
 */
function updateVisibilityInLocalStorage (isVisible) {
  khtLog(`Текущее значение видимости в localStorage: ${isVisible ? '1' : '0'}.`, 'debug')
  localStorage.setItem('KhTechVisible', isVisible ? '0' : '1')
  khtLog(`Значение видимости обновлено в localStorage: ${isVisible ? '0' : '1'}.`, 'debug')
}

/**
 * Инициализирует и запускает MutationObserver для отслеживания изменений в DOM.
 */
function initMutationObserver () {
  khtLog('Инициализация MutationObserver.', 'debug')
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains('topNotification')) {
          khtLog('Обнаружено верхнее уведомление.', 'debug')
          const isVisible = localStorage.getItem('KhTechVisible') !== '1'
          khtLog(`Текущее значение видимости в localStorage: ${isVisible ? '1' : '0'}.`, 'debug')
          node.style.display = isVisible ? 'block' : 'none'
        }
      })
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
  khtLog('MutationObserver инициализирован.', 'debug')
}

/**
 * Обрабатывает загрузку документа, настраивая начальное состояние элементов.
 */
function khtSetDefaultState () {
  khtLog('Установка начального состояния элементов.', 'debug')
  initMutationObserver()

  const isVisible = localStorage.getItem('KhTechVisible') !== '1'
  toggleTrainingRows(!isVisible)
  toggleTopNotification(!isVisible)
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', khtSetDefaultState)
  : khtSetDefaultState()

/**
 * Переключает видимость элементов на странице.
 */
export function khtTFToggleVisible () {
  khtLog('Переключение видимости элементов.', 'debug')
  const isVisible = localStorage.getItem('KhTechVisible') !== '1'
  toggleTrainingRows(isVisible)
  toggleTopNotification(isVisible)
  updateVisibilityInLocalStorage(isVisible)
  khtLog('Переключение видимости элементов выполнено.', 'debug')
}
