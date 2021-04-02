/* eslint-disable no-unused-vars */
'use strict'

const logger = require('winston')

// Constants
const HB = 0
const LB = 1
// Data types
const FLAG8 = 0 // byte composed of 8 single-bit flags
const U8 = 1 // unsigned 8-bit integer 0 .. 255
const S8 = 2 // signed 8-bit integer -128 .. 127 (two’s compliment)
const U16 = 3 // unsigned 16-bit integer 0..65535
const S16 = 4 // signed 16-bit integer -32768..32767
const F8_8 = 5 // signed fixed point value  = 1 sign bit, 7 integer bits, 8 fractional bits
const DAYTIME = 6
const DATE = 7
const YEAR = 8
const REMEHA_SERVICE = 9
// Message types
const READDATA = 0 // 0b000
const WRITEDATA = 1 // 0b001
const INVALIDDATA = 2 // 0b010
const READACK = 4 // 0b100
const WRITEACK = 5 // 0b101
const DATAINVALID = 6 // 0b110
const UNKNOWNDATAID = 7 // 0b111

const msgTypes = {
  0: 'Read-Data',
  1: 'Write-Data',
  2: 'Invalid-Data',
  3: 'Reserved',
  4: 'Read-Ack',
  5: 'Write-Ack',
  6: 'Data-Invalid',
  7: 'Unknown-DataId'
}

const dayOfWeek = [
  'unknown',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]
const months = [
  'unknown',
  'januari',
  'februari',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

const dataIds = {
  0: {
    description: 'Master and slave status flags',
    parseData: [
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 0,
        property: 'fault'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 1,
        property: 'ch_active'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 2,
        property: 'dhw_active'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 3,
        property: 'flame_on'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 4,
        property: 'cooling_active'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 5,
        property: 'ch2_active'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 6,
        property: 'diagnostic'
      },
      {
        msgType: READACK,
        type: LB,
        data: FLAG8,
        bit: 7,
        property: 'electricity_production'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 0,
        property: 'ch_enabled'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 1,
        property: 'dhw_enabled'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 2,
        property: 'cooling_enabled'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 3,
        property: 'outside_temperature_correction_active'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 4,
        property: 'ch2_enabled'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 5,
        property: 'summer_winter_mode'
      },
      {
        msgType: READDATA,
        type: HB,
        data: FLAG8,
        bit: 6,
        property: 'dhw_blocking'
      }
    ]
  },
  1: {
    description: 'Central heating control setpoint in °C',
    parseData: [
      {
        data: F8_8,
        property: 'ch_setpoint'
      }
    ]
  },
  2: {
    description: 'Master configuration flags',
    parseData: [
      {
        type: HB,
        data: FLAG8,
        bit: 0,
        property: 'smartpower_supported'
      },
      {
        type: LB,
        data: U8,
        property: 'master_memberidcode'
      }
    ]
  },
  3: {
    description: 'Slave configuration flags',
    parseData: [
      {
        type: HB,
        data: FLAG8,
        bit: 0,
        property: 'dhw_present'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 1,
        property: 'onoff'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 2,
        property: 'cooling_supported'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 3,
        property: 'dhw_tank_present'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 4,
        property: 'pump_control_allowed'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 5,
        property: 'ch2_present'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 6,
        property: 'remote_water_filling'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 7,
        property: 'heat_cool_mode_control'
      },
      {
        type: LB,
        data: U8,
        property: 'slave_memberidcode'
      }
    ]
  },
  4: {
    description: 'Command',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'cmd_code'
      },
      {
        type: LB,
        data: U8,
        property: 'cmd_resp_code'
      }
    ]
  },
  5: {
    description: 'Application specific fault flags',
    parseData: [
      {
        type: HB,
        data: FLAG8,
        bit: 0,
        property: 'service_required'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 1,
        property: 'remote_reset_enabled'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 2,
        property: 'water_pressure_fault'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 3,
        property: 'gas_flame_fault'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 4,
        property: 'air_pressure_fault'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 5,
        property: 'water_over_temp'
      },
      {
        type: LB,
        data: U8,
        property: 'oem_fault_code'
      }
    ]
  },
  6: {
    description: 'Remote parameter flags',
    parseData: [
      {
        type: HB,
        data: FLAG8,
        bit: 0,
        property: 'dhw_setpoint_tx_enabled'
      },
      {
        type: HB,
        data: FLAG8,
        bit: 1,
        property: 'max_ch_setpoint_tx_enabled'
      },
      {
        type: LB,
        data: FLAG8,
        bit: 0,
        property: 'dhw_setpoint_rw'
      },
      {
        type: LB,
        data: FLAG8,
        bit: 1,
        property: 'max_ch_setpoint_rw'
      }
    ]
  },
  7: {
    description: 'Cooling control',
    parseData: [
      {
        data: F8_8,
        property: 'cooling_signal'
      }
    ]
  },
  8: {
    description: 'Central heating setpoint 2nd circuit in °C',
    parseData: [
      {
        data: F8_8,
        property: 'ch2_setpoint'
      }
    ]
  },
  9: {
    description: 'Remote override room setpoint in °C',
    parseData: [
      {
        data: F8_8,
        property: 'override_room_setpoint'
      }
    ]
  },
  10: {
    description: 'Number of transparant slave parameters',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'num_of_tsp'
      }
    ]
  },
  11: {
    description: 'Transparant slave parameter index/value',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'tsp_index'
      },
      {
        type: LB,
        data: U8,
        property: 'tsp_value'
      }
    ]
  },
  12: {
    description: 'Fault history buffer size',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'fault_history_buffer_size'
      }
    ]
  },
  13: {
    description: 'Fault history buffer index/value',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'fault_history_index'
      },
      {
        type: LB,
        data: U8,
        property: 'fault_history_value'
      }
    ]
  },
  14: {
    description: 'Max. relative modulation level',
    parseData: [
      {
        data: F8_8,
        property: 'max_rel_mod_level'
      }
    ]
  },
  15: {
    description: 'Max. capacity / Min. modulation level',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'max_capacity'
      },
      {
        type: LB,
        data: U8,
        property: 'min_mod_lev'
      }
    ]
  },
  16: {
    description: 'Room setpoint in °C',
    parseData: [
      {
        data: F8_8,
        property: 'room_setpoint'
      }
    ]
  },
  17: {
    description: 'Rel. modulation level',
    parseData: [
      {
        data: F8_8,
        property: 'rel_mod_level'
      }
    ]
  },
  18: {
    description: 'Central heating water pressure in bar',
    parseData: [
      {
        data: F8_8,
        property: 'ch_pressure'
      }
    ]
  },
  19: {
    description: 'Domestic hot water flow rate in l/min',
    parseData: [
      {
        data: F8_8,
        property: 'dhw_flow_rate'
      }
    ]
  },
  20: {
    description: 'DayTime',
    parseData: [
      {
        data: DAYTIME,
        property: 'day_time'
      }
    ]
  },
  21: {
    description: 'Date',
    parseData: [
      {
        data: DATE,
        property: 'date'
      }
    ]
  },
  22: {
    description: 'Year',
    parseData: [
      {
        data: YEAR,
        property: 'year'
      }
    ]
  },
  23: {
    description: 'Room setpoint 2nd cicuit in °C',
    parseData: [
      {
        data: F8_8,
        property: 'room2_setpoint'
      }
    ]
  },
  24: {
    description: 'Room temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'room_temperature'
      }
    ]
  },
  25: {
    description: 'Boiler water temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'ch_temperature'
      }
    ]
  },
  26: {
    description: 'Domestic hot water temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'dhw_temperature'
      }
    ]
  },
  27: {
    description: 'Outside temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'outside_temperature'
      }
    ]
  },
  28: {
    description: 'Return water temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'return_temperature'
      }
    ]
  },
  29: {
    description: 'Solar storage water temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'solar_storage_temperature'
      }
    ]
  },
  30: {
    description: 'Solar collector temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'solar_collector_temperature'
      }
    ]
  },
  31: {
    description: 'Central heating flow temperature 2nd circuit in °C',
    parseData: [
      {
        data: F8_8,
        property: 'ch2_flow_temperature'
      }
    ]
  },
  32: {
    description: 'Domestic hot water setpoint 2nd circuit in °C',
    parseData: [
      {
        data: F8_8,
        property: 'dhw2_setpoint'
      }
    ]
  },
  33: {
    description: 'Exhaust temperature in °C',
    parseData: [
      {
        data: F8_8,
        property: 'exhaust_temperature'
      }
    ]
  },
  // 34: Boiler heat exchanger temperature (°C)
  35: {
    description: 'Fan speed',
    parseData: [
      {
        data: U16,
        property: 'fan_speed'
      }
    ]
  },
  36: {
    description: 'Electrical current through burner flame',
    parseData: [
      {
        data: F8_8,
        property: 'burner_current'
      }
    ]
  },
  37: {
    description: 'Room temperature 2nd circuit in °C',
    parseData: [
      {
        data: F8_8,
        property: 'room2_temperature'
      }
    ]
  },
  38: {
    description: 'Relative humidity',
    parseData: [
      {
        data: U8,
        property: 'rel_humidity_1'
      },
      {
        data: U8,
        property: 'rel_humidity_2'
      }
    ]
  },
  48: {
    description: 'Hot water setpoint range',
    parseData: [
      {
        type: LB,
        data: S8,
        property: 'dhw_setpoint_high'
      },
      {
        type: HB,
        data: S8,
        property: 'dhw_setpoint_low'
      }
    ]
  },
  49: {
    description: 'Central heating setpoint range',
    parseData: [
      {
        type: LB,
        data: S8,
        property: 'ch_setpoint_high'
      },
      {
        type: HB,
        data: S8,
        property: 'ch_setpoint_low'
      }
    ]
  },
  50: {
    description: 'Hcratio-UB / Hcratio-LB',
    parseData: [
      {
        type: LB,
        data: S8,
        property: 'heat_curve_ratio_ub'
      },
      {
        type: HB,
        data: S8,
        property: 'heat_curve_ratio_lb'
      }
    ]
  },
  56: {
    description: 'Domestic hot water setpoint in °C',
    parseData: [
      {
        data: F8_8,
        property: 'dhw_setpoint'
      }
    ]
  },
  57: {
    description: 'Max. allowable central heating setpoint',
    parseData: [
      {
        data: F8_8,
        property: 'max_ch_setpoint'
      }
    ]
  },
  58: {
    description: 'Hcratio',
    parseData: [
      {
        data: F8_8,
        property: 'heat_curve_ratio'
      }
    ]
  },
  // 70:HB0: Master status ventilation / heat-recovery: Ventilation enable
  // 70:HB1: Master status ventilation / heat-recovery: Bypass postion
  // 70:HB2: Master status ventilation / heat-recovery: Bypass mode
  // 70:HB3: Master status ventilation / heat-recovery: Free ventilation mode
  // 70:LB0: Slave status ventilation / heat-recovery: Fault indication
  // 70:LB1: Slave status ventilation / heat-recovery: Ventilation mode
  // 70:LB2: Slave status ventilation / heat-recovery: Bypass status
  // 70:LB3: Slave status ventilation / heat-recovery: Bypass automatic status
  // 70:LB4: Slave status ventilation / heat-recovery: Free ventilation status
  // 70:LB6: Slave status ventilation / heat-recovery: Diagnostic indication
  // 71: Relative ventilation position (0-100%). 0% is the minimum set ventilation and 100% is the maximum set ventilation
  // 72: Application-specific fault flags and OEM fault code ventilation / heat-recovery
  // 73: An OEM-specific diagnostic/service code for ventilation / heat-recovery system
  // 74:HB0: Slave Configuration ventilation / heat-recovery: System type
  // 74:HB1: Slave Configuration ventilation / heat-recovery: Bypass
  // 74:HB2: Slave Configuration ventilation / heat-recovery: Speed control
  // 74:LB: Slave MemberID Code ventilation / heat-recovery
  // 75: The implemented version of the OpenTherm Protocol Specification in the ventilation / heat-recovery system
  // 76: Ventilation / heat-recovery product version number and type
  // 77: Relative ventilation (0-100%)
  // 78: Relative humidity exhaust air (0-100%)
  // 79: CO2 level exhaust air (0-2000 ppm)
  // 80: Supply inlet temperature (°C)
  // 81: Supply outlet temperature (°C)
  // 82: mExhaust inlet temperature (°C)
  // 83: Exhaust outlet temperature (°C)
  // 84: Exhaust fan speed in rpm
  // 85: Supply fan speed in rpm
  // 86:HB0: Remote ventilation / heat-recovery parameter transfer-enable: Nominal ventilation value
  // 86:LB0: Remote ventilation / heat-recovery parameter read/write : Nominal ventilation value
  // 87: Nominal relative value for ventilation (0-100 %)
  // 88: Number of Transparent-Slave-Parameters supported by TSP’s ventilation / heat-recovery
  // 89: Index number / Value of referred-to transparent TSP’s ventilation / heat-recovery parameter
  // 90: Size of Fault-History-Buffer supported by ventilation / heat-recovery
  // 91: Index number / Value of referred-to fault-history buffer entry ventilation / heat-recovery
  // 98: For a specific RF sensor the RF strength and battery level is written
  // 99: Operating Mode HC1, HC2/ Operating Mode DHW
  100: {
    description: 'Remote override function',
    parseData: [
      {
        type: LB,
        data: FLAG8,
        bit: 0,
        property: 'manual_priority'
      },
      {
        type: LB,
        data: FLAG8,
        bit: 1,
        property: 'schedule_priority'
      }
    ]
  },
  // 101:HB012: Master Solar Storage: Solar mode
  // 101:LB0: Slave Solar Storage: Fault indication
  // 101:LB123: Slave Solar Storage: Solar mode status
  // 101:LB45: Slave Solar Storage: Solar status
  // 102: Application-specific fault flags and OEM fault code Solar Storage
  // 103:HB0: Slave Configuration Solar Storage: System type
  // 103:LB: Slave MemberID Code Solar Storage
  // 104: Solar Storage product version number and type
  // 105: Number of Transparent-Slave-Parameters supported by TSP’s Solar Storage
  // 106: Index number / Value of referred-to transparent TSP’s Solar Storage parameter
  // 107: Size of Fault-History-Buffer supported by Solar Storage
  // 108: Index number / Value of referred-to fault-history buffer entry Solar Stor
  // 109: Electricity producer starts
  // 110: Electricity producer hours
  // 111: Electricity production
  // 112: Cumulativ Electricity production
  // 113: Number of un-successful burner starts
  // 114: Number of times flame signal was too low
  115: {
    description: 'OEM diagnostic code',
    parseData: [
      {
        data: U16,
        property: 'oem_service_code'
      }
    ]
  },
  116: {
    description: 'Burner starts',
    parseData: [
      {
        data: U16,
        property: 'burner_starts'
      }
    ]
  },
  117: {
    description: 'CH pump starts',
    parseData: [
      {
        data: U16,
        property: 'ch_pump_starts'
      }
    ]
  },
  118: {
    description: 'DHW pump/valve starts',
    parseData: [
      {
        data: U16,
        property: 'dhw_pump_starts'
      }
    ]
  },
  119: {
    description: 'DHW burner starts',
    parseData: [
      {
        data: U16,
        property: 'dhw_burner_starts'
      }
    ]
  },
  120: {
    description: 'Burner operation hours',
    parseData: [
      {
        data: U16,
        property: 'burner_hours'
      }
    ]
  },
  121: {
    description: 'CH pump operation hours',
    parseData: [
      {
        data: U16,
        property: 'ch_pump_hours'
      }
    ]
  },
  122: {
    description: 'DHW pump/valve operation hours',
    parseData: [
      {
        data: U16,
        property: 'dhw_pump_hours'
      }
    ]
  },
  123: {
    description: 'DHW burner operation hours',
    parseData: [
      {
        data: U16,
        property: 'dhw_burner_hours'
      }
    ]
  },
  124: {
    description: 'OpenTherm version Master',
    parseData: [
      {
        data: F8_8,
        property: 'otver_master'
      }
    ]
  },
  125: {
    description: 'OpenTherm version Slave',
    parseData: [
      {
        data: F8_8,
        property: 'otver_slave'
      }
    ]
  },
  126: {
    description: 'Master-version',
    parseData: [
      {
        type: HB,
        data: U8,
        property: 'master_product_type'
      },
      {
        type: LB,
        data: U8,
        property: 'master_product_version'
      }
    ]
  },
  127: {
    description: 'Slave-version',
    parseData: [
      {
        type: LB,
        data: U8,
        property: 'slave_product_type'
      },
      {
        type: HB,
        data: U8,
        property: 'slave_product_version'
      }
    ]
  },
  131: {
    description: 'Remeha dF-/dU-codes',
    parseData: [
      {
        type: LB,
        data: U8,
        property: 'remeha_df_code'
      },
      {
        type: HB,
        data: U8,
        property: 'remeha_du_code'
      }
    ]
  },
  132: {
    description: 'Remeha service message',
    parseData: [
      {
        data: REMEHA_SERVICE,
        property: 'remeha_service_required'
      }
    ]
  },
  133: {
    description: 'Remeha detection connected SCU’s',
    parseData: [
      {
        type: LB,
        data: U8,
        property: 'remeha_scu_part1'
      },
      {
        type: HB,
        data: U8,
        property: 'remeha_scu_part2'
      }
    ]
  }
}

// Add a transport as fall back when no parent logger has been initialized
// to prevent the error: "Attempt to write logs with no transports"
logger.add(new logger.transports.Console({
  level: 'none'
}))

// Function to convert the F8_8 data tye to a float
function toFloat (val) {
  logger.debug(`toFloat: Entering with ${val}`)

  if (val & 0x8000) {
    return Math.round((((~(0x100 - (val >> 8)) + 1) + ((val & 0xFF) / 256)) * 100)) / 100
  } else {
    return Math.round((((val & 0xFF00) >> 8) + ((val & 0xFF) / 256)) * 100) / 100
  }
}

// Process the data according to the specification of its data Id
function convert (msg, data) {
  const svcType = { 1: 'Type A', 2: 'Type B', 3: 'Type C' }

  logger.debug(`processData: Entering with ${JSON.stringify(msg)} and ${data}`)

  data = parseInt(data, 16)

  if (msg.type === HB) {
    // Parse only the MSB
    data >>= 8
  }

  if (msg.type === LB) {
    // Parse only the LSB
    data &= 0xFF
  }

  switch (msg.data) {
    case FLAG8:
      logger.debug(`parser.convert-FLAG8: Data ${data.toString(2)}`)
      data = ((data & (1 << msg.bit)) > 0)
      logger.debug(`parser.convert-FLAG8: Bit ${msg.bit} - ${data}`)
      break

    case S8:
      if (data & 0x80) {
        data -= 0x100
      }
      break

    case S16:
      if (data & 0x8000) {
        data -= 0x10000
      }
      break

    case F8_8:
      data = toFloat(data)
      break

    case DAYTIME:
      if ((data >> 13) > 0 < 7 && ((data >> 8) & 0x1F) < 24 && (data & 0xFF) < 60) {
        data = `${dayOfWeek[data >> 13]}, ${(data >> 8) & 0x1F}:${data & 0xFF}`
      }
      break

    case DATE:
      if ((data >> 8) > 0 < 13 && (data & 0xFF) > 0 < 32) {
        data = `${months[data >> 8]}, ${data & 0xFF}`
      }
      break

    case REMEHA_SERVICE:
      if ((data >> 8) === 0) {
        data = 'None'
      } else {
        data = svcType[data & 0x0F] || 'Unknown'
      }
      break
  }

  return {
    property: msg.property,
    value: data
  }
}

module.exports = data => {
  const properties = {}

  logger.silly(`parser.process: Entering with ${data}`)

  if (data.length !== 8) {
    logger.error('Invalid length of Opentherm message')

    return {}
  }

  const dataId = parseInt(data.substr(2, 2), 16)

  const msgType = (parseInt(data.substr(0, 2), 16) & 0x70) >> 4

  if (dataIds[dataId]) {
    for (const index in dataIds[dataId].parseData) {
      if (dataIds[dataId].parseData[index].msgType === undefined || dataIds[dataId].parseData[index].msgType === msgType) {
        const result = convert(dataIds[dataId].parseData[index], data.substr(4))
        if (result.property) {
          properties[result.property] = result.value
        }
      }
    }
  }

  return {
    msgType: msgTypes[msgType],
    dataId: { id: dataId, name: dataIds[dataId] ? dataIds[dataId].name : 'Unknown' },
    properties
  }
}
