import { khtLog } from 'https://cdn.jsdelivr.net/gh/anleyn/plugin@main/lib/core/libLog.min.js'
import { khtTFToggleVisible } from 'https://cdn.jsdelivr.net/gh/anleyn/plugin@main/dnt/teach/control/stream/toggleVisible.js'

/**
 * Проверяет, соответствует ли URL одному из путей в массиве
 *
 * @param {string} url - URL для проверки.
 * @param {string[]} pathArray - Массив путей для сопоставления.
 * @returns {boolean} Возвращает true, если URL соответствует одному из путей.
 */
function khtPathMatches (url, pathArray) {
  try {
    url = url.endsWith('/') ? url : url + '/'

    return pathArray.some(path => {
      path = path.endsWith('/') ? path : path + '/'
      khtLog(`Сравнение: ${url} и ${path}`, 'debug')
      const result = new RegExp(`^${path}`).test(url)
      khtLog(`Результат: ${result}`, 'debug')
      return result
    })
  } catch (error) {
    khtLog(`Ошибка в функции khtPathMatches: ${error.message}`, 'error')
    return false
  }
}

/**
 * Добавляет меню плагина.
 *
 * @param {Object} params - Объект с настройками отображения.
 */
function khtCreateNewMenuItem (params) {
  try {
    khtLog('Создание нового элемента меню: ' + params.title, 'debug')

    // Добавление элемента меню
    setTimeout(() => {
      $(`.${params.menuContainer}`).append(`
        <li class="menu-item ${params.className}" data-item="${params.className.split('-')[2]}">
          <a class="menu-item-label" href="javascript:void(0);" title="${params.title}">
            <i class="${params.iconClass} menu-item-icon" style="font-size: 20px; color: #918b9d;"></i>
          </a>
        </li>
      `)
    }, 0)

    khtLog('Добавление обработчиков событий', 'debug')
    // Обработчик клика на элемент меню
    $('body').on('click', `.${params.className}`, khtOnMenuItemClick.bind(null, params))

    // Обработчик клика на другие элементы меню или на подложку
    $('body').on('click', `.menu-item:not(.${params.className}), .gc-fade-wrapper`, () => {
      $(`.${params.className}`).removeClass('selected')
    })
  } catch (error) {
    khtLog(`Ошибка в функции khtCreateNewMenuItem: ${error.message}`, 'error')
  }
}

/**
 * Обработчик клика на элемент меню.
 *
 * @param {Object} params - Параметры элемента меню.
 * @param {Event} e - Событие клика.
 */
function khtOnMenuItemClick (params, e) {
  try {
    khtLog('Обработка клика на элемент меню: ' + params.title, 'debug')
    const currentPath = window.location.pathname
    khtLog('Текущий путь: ' + currentPath, 'debug')
    const currentHost = window.location.host
    khtLog('Текущий хост: ' + currentHost, 'debug')
    const currentURL = window.location.href
    khtLog('Текущий URL: ' + currentURL, 'debug')

    let subItems = {}

    khtLog('Поиск подменю', 'debug')
    params.subitems.forEach(item => {
      if (khtPathMatches(currentHost + currentPath, item.path) || item.include.some(part => currentURL.includes(part))) {
        subItems = { ...subItems, ...item.items }
      }
    })
    khtLog('Подменю: ' + JSON.stringify(subItems), 'debug')

    khtLog('Отображение подменю', 'debug')
    showSubMenu(params, subItems)
    khtLog('Добавление класса selected', 'debug')
    $('.menu-item.selected').removeClass('selected')
    khtLog('Удаление класса selected у других элементов меню', 'debug')
    $(`.${params.className}`).addClass('selected')
  } catch (error) {
    khtLog(`Ошибка в функции khtOnMenuItemClick: ${error.message}`, 'error')
  }
}

/**
 * Показывает подменю для выбранного элемента.
 *
 * @param {Object} params - Параметры элемента меню.
 * @param {Object} subItems - Элементы подменю.
 */
function showSubMenu (params, subItems) {
  try {
    khtLog('Отображение подменю для: ' + params.title, 'debug')
    if (!$.isEmptyObject(subItems)) {
      khtLog('Подменю не пустое', 'debug')
      khtLog('Удаление старого подменю', 'debug')
      const $submenu = $('.gc-account-user-submenu-bar').empty()
      khtLog('Добавление заголовка', 'debug')
      $submenu.append(`<div><h3>${params.title}</h3></div>`)
      khtLog('Добавление списка', 'debug')
      const $list = $('<ul class="gc-account-user-submenu"></ul>').appendTo($submenu)

      khtLog('Добавление элементов подменю', 'debug')
      Object.entries(subItems).forEach(([key, value]) => {
        const $item = $(`<li><a class="subitem-link" target="_self" href="javascript:void(0);">${key}</a></li>`).appendTo($list)
        if (typeof value === 'string') {
          $item.find('a').attr('href', value)
        } else if (typeof value === 'function') {
          $item.find('a').on('click', value)
        }
      })
    }
  } catch (error) {
    khtLog(`Ошибка в функции showSubMenu: ${error.message}`, 'error')
  }
}

$(function () {
  try {
    khtLog('Инициализация плагина', 'info')

    // Получение и проверка ID пользователя
    const userId = JSON.parse(localStorage.getItem('session'))?.user_id
    khtLog('ID пользователя: ' + userId, 'debug')
    const allowedUserIds = [291392837, 265475720, 120450348, 298909149]
    khtLog('Разрешенные ID: ' + allowedUserIds, 'debug')

    if (!allowedUserIds.includes(userId)) {
      khtLog('ID пользователя не в списке разрешенных', 'warn')
      return
    }

    // Создание элементов меню
    const params = {
      menuContainer: 'gc-account-user-menu',
      className: 'menu-item-settings',
      title: 'KhTech',
      iconClass: 'fa fa-cog',
      subitems: [
        {
          path: [
            'denginatrendah.ru/teach/control',
            'denginatrendah.ru/teach/control/stream'
          ],
          include: [],
          items: {
            'Показать/скрыть': khtTFToggleVisible
          }
        },
        {
          path: [],
          include: ['/pl/tasks/mission/update'],
          items: {
            'Очистить исполнителей': window.KhTechRmExecutors
          }
        },
        {
          path: [],
          include: ['/pl/tasks/mission'],
          items: {
            'Показать архив': window.toggleArchiveVisibility
          }
        },
        {
          path: [],
          include: ['denginatrendah.ru'],
          items: {
            'Андрей Худолей': 'https://denginatrendah.ru/user/control/user/update/id/291392837',
            Тестовый: 'https://denginatrendah.ru/user/control/user/update/id/292254823'
          }
        },
        {
          path: [],
          include: ['gc.khudoley.pro'],
          items: {
            'Андрей Худолей': 'https://gc.khudoley.pro/user/control/user/update/id/265475720',
            Тестовый: 'https://gc.khudoley.pro/user/control/user/update/id/266755393'
          }
        }
      ]
    }
    khtLog('Параметры меню: ' + JSON.stringify(params), 'debug')
    khtLog('Создание элементов меню', 'debug')
    khtCreateNewMenuItem(params)
    khtLog('Плагин инициализирован', 'info')
  } catch (error) {
    khtLog(`Ошибка при инициализации: ${error.message}`, 'error')
  }
})
