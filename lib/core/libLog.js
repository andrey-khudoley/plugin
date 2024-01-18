/**
 * @file Модуль логирования для отладки.
 */

const logConfig = {
  enabled: true,
  level: 'debug'
}

const logLevels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
}

/**
 * Выводит сообщение в консоль, если уровень логирования сообщения совпадает или превышает текущий уровень логирования.
 *
 * @param {string} message - Сообщение, которое нужно вывести.
 * @param {string} [level='debug'] - Уровень логирования сообщения ('debug', 'info', 'warn', 'error').
 */
export function khtLog (message, level = 'error') {
  if (logConfig.enabled && logLevels[level] >= logLevels[logConfig.level]) {
    console.log('KhTPlugin: ' + message)
  }
}
