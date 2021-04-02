/* eslint-disable mocha/no-hooks-for-single-case */

const assert = require('chai').assert
const logger = require('winston')

const parser = require('../lib')

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console({
  format: logger.format.combine(
    logger.format.timestamp(),
    logger.format.colorize(),
    logger.format.printf(event => {
      return `${event.timestamp} ${event.level}: ${event.message}`
    })
  ),
  level: 'none'
}))

describe('Check all different data types', function () {
  it('parse a bitmap data type (FLAG8)', function () {
    const result = parser('4000CCCC')
    assert.strictEqual(result.msgType, 'Read-Ack', 'wrong message type reported')
    assert.strictEqual(result.properties.fault, false, 'wrong property value reported')
    assert.strictEqual(result.properties.ch_active, false, 'wrong property value reported')
    assert.strictEqual(result.properties.dhw_active, true, 'wrong property value reported')
    assert.strictEqual(result.properties.flame_on, true, 'wrong property value reported')
    assert.strictEqual(result.properties.cooling_active, false, 'wrong property value reported')
    assert.strictEqual(result.properties.ch2_active, false, 'wrong property value reported')
    assert.strictEqual(result.properties.diagnostic, true, 'wrong property value reported')
  })

  it('Parse a float data type (F8_8)', function () {
    const result = parser('001B1490')
    assert.strictEqual(result.msgType, 'Read-Data', 'wrong message type reported')
    assert.strictEqual(result.properties.outside_temperature, 20.56, 'wrong property value reported')
  })

  it('Parse a signed 8-bit integer data type (S8)', function () {
    const result = parser('10312230')
    assert.strictEqual(result.msgType, 'Write-Data', 'wrong message type reported')
    assert.strictEqual(result.properties.ch_setpoint_high, 48, 'wrong property value reported')
    assert.strictEqual(result.properties.ch_setpoint_low, 34, 'wrong property value reported')
  })

  it('Parse a daytime data type (DAYTIME)', function () {
    const result = parser('2014541E')
    assert.strictEqual(result.msgType, 'Invalid-Data', 'wrong message type reported')
    assert.strictEqual(result.properties.day_time, 'tuesday, 20:30', 'wrong property value reported')
  })

  it('Parse a date data type (DATE)', function () {
    const result = parser('3015030D')
    assert.strictEqual(result.msgType, 'Reserved', 'wrong message type reported')
    assert.strictEqual(result.properties.date, 'march, 13', 'wrong property value reported')
  })

  it('Parse a year data type (YEAR)', function () {
    const result = parser('401607E5')
    assert.strictEqual(result.msgType, 'Read-Ack', 'wrong message type reported')
    assert.strictEqual(result.properties.year, 2021, 'wrong property value reported')
  })

  it('Parse a remeha service data type (REMEHA_SERVICE)', function () {
    const result = parser('20840101')
    assert.strictEqual(result.msgType, 'Invalid-Data', 'wrong message type reported')
    assert.strictEqual(result.properties.remeha_service_required, 'Type A', 'wrong property value reported')
  })
})
