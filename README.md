
# Opentherm parser

[![Build](https://github.com/reneklootwijk/node-opentherm-parser/workflows/build/badge.svg)](https://github.com/reneklootwijk/node-opentherm-parser/actions)
[![Coverage Status](https://coveralls.io/repos/github/reneklootwijk/node-opentherm-parser/badge.svg?branch=master)](https://coveralls.io/github/reneklootwijk/node-opentherm-parser?branch=master)
[![npm](https://img.shields.io/npm/v/node-opentherm-parser)](https://www.npmjs.com/package/node-opentherm-parser)

This module parses the opentherm messages passed to it.

## Installation

```bash
npm install node-opentherm-parser
```

## Usage

Usage of the module is very straight forward, include the module in your script and pass it an Opentherm message.

```javascript
const parser = require('node-opentherm-parser')

console.log(parser('C000CCCC'))
```

The response is a JSON object of the form:

```javascript
{
  msgType: 'Read-Ack',
  dataId: { id: 0, name: 'Status' },
  properties: {
    fault: false,
    ch_active: false,
    dhw_active: true,
    flame_on: true,
    cooling_active: false,
    ch2_active: false,
    diagnostic: true,
    electricity_production: true
  }
}
```

where:

* *msgType* is one of:

  * Read-Data
  * Write-Data
  * Invalid-Data
  * Reserved
  * Read-Ack
  * Write-Ack
  * Data-Invalid
  * Unknown-DataId

* *dataId* is the Opentherm data object containing the id and name
* *properties* is an object containing all properties of the data object and their values

## Supported Data objects and their properties

The following data objects and properties are supported by this module:

|DataId|Name|Msg Type|Properties|Values|
|---|---|---|---|---|
|0|Master and slave status flags|Read-Ack|fault|true/false|
||||ch_active|true/false|
||||dhw_active|true/false|
||||flame_on|true/false|
||||cooling_active|true/false|
||||ch2_active|true/false|
||||diagnostic|true/false|
||||electricity_production|true/false|
|||Read-Data|ch_enabled|true/false|
||||dhw_enabled|true/false|
||||cooling_enabled|true/false|
||||outside_temperature_correction_active|true/false|
||||ch2_enabled|true/false|
||||summer_winter_mode|true/false|
||||dhw_blocking|true/false|
|1|Central heating control setpoint|n.a.|ch_setpoint|number|
|2|Master configuration flags|n.a.|smartpower_supported|true/false|
||||master_memberidcode|number|
|3|Slave configuration flags|n.a.|dhw_present|true/false|
||||onoff|true/false|
||||cooling_supported|true/false|
||||dhw_tank_present|true/false|
||||pump_control_allowed|true/false|
||||ch2_present|true/false|
||||remote_water_filling|true/false|
||||heat_cool_mode_control|true/false|
||||slave_memberidcode|number|
|4|Command|n.a.|cmd_code|number|
||||cmd_resp_code|number|
|5|Application specific fault flags|n.a.|service_required|true/false|
||||remote_reset_enabled|true/false|
||||water_pressure_fault|true/false|
||||gas_flame_fault|true/false|
||||air_pressure_fault|true/false|
||||water_over_temp|true/false|
||||oem_fault_code|number|
|6|Remote parameter flags|n.a.|dhw_setpoint_tx_enabled|true/false|
||||max_ch_setpoint_tx_enabled|true/false|
||||dhw_setpoint_rw|true/false|
||||max_ch_setpoint_rw|true/false|
|7|Cooling control|n.a.|cooling_signal|true/false|
|8|Central heating setpoint 2nd circuit in °C|n.a.|ch2_setpoint|number|
|9|Remote override room setpoint in °C|n.a.|override_room_setpoint|number|
|10|Number of transparant slave parameters|n.a.|num_of_tsp|true/false|
|11|Transparant slave parameter index/value|n.a.|tsp_index|number|
||||tsp_value|number|
|12|Fault history buffer size|n.a.|fault_history_buffer_size|number|
|13|Fault history buffer index/value|n.a.|fault_history_index|number|
||||fault_history_value|number|
|14|Max. relative modulation levelg|n.a.|max_rel_mod_level|number|
|15|Max. capacity / Min. modulation level|n.a.|max_capacity|number|
||||min_mod_lev|number|
|16|Room setpoint in °C|n.a.|room_setpoint|number|
|17|Rel. modulation level|n.a.|rel_mod_level|number|
|18|Central heating water pressure in bar|n.a.|ch_pressure|number|
|19|Domestic hot water flow rate in l/min|n.a.|dhw_flow_rate|number|
|20|DayTime|n.a.|day_time|day of week, time|
|21|Date|n.a.|date|month, day of month|
|22|Year|n.a.|year|year|
|23|Room setpoint 2nd cicuit in °C|n.a.|room2_setpoint|number|
|24|Room temperature in °C|n.a.|room_temperature|number|
|25|Boiler water temperature in °C|n.a.|ch_temperature|number|
|26|Domestic hot water temperature in °C|n.a.|dhw_temperature|number|
|27|Outside temperature in °C|n.a.|outside_temperature|number|
|28|Return water temperature in °C|n.a.|return_temperature|number|
|29|Solar storage water temperature in °C|n.a.|solar_storage_temperature|number|
|30|Solar collector temperature in °C|n.a.|solar_collector_temperature|number|
|31|Central heating flow temperature 2nd circuit in °C|n.a.|ch2_flow_temperature|number|
|32|Domestic hot water setpoint 2nd circuit in °C|n.a.|dhw2_setpoint|number|
|33|Exhaust temperature in °C|n.a.|exhaust_temperature|number|
|35|Fan speed|n.a.|fan_speed|number|
|36|Electrical current through burner flame|n.a.|burner_current|number|
|37|Room temperature 2nd circuit in °C|n.a.|room2_temperature|number|
|38|Relative humidity|n.a.rel_humidity_1|number|
||||rel_humidity_2|number|
|48|Hot water setpoint range|n.a.|dhw_setpoint_high|number|
||||dhw_setpoint_low|number|
|49|Central heating setpoint range|n.a.|ch_setpoint_high|number|
||||ch_setpoint_low|number|
|50|Hcratio-UB / Hcratio-LB|n.a.|heat_curve_ratio_ub|number|
||||heat_curve_ratio_lb|number|
|56|Domestic hot water setpoint in °C|n.a.|dhw_setpoint|number|
|57|Max. allowable central heating setpoint|n.a.|max_ch_setpoint|number|
|58|Hcratio|n.a.|heat_curve_ratio|number|
|100|Remote override function|n.a.|manual_priority|true/false|
||||schedule_priority|number|
|115|OEM diagnostic code|n.a.|oem_service_code|number|
|116|Burner starts|n.a.|burner_starts|number|
|117|CH pump starts|n.a.|ch_pump_starts|number|
|118|DHW pump / valve starts|n.a.|dhw_pump_starts|number|
|119|DHW burner starts|n.a.|dhw_burner_starts|number|
|120|Burner operation hours|n.a.|burner_hours|number|
|121|CH pump operation hours|n.a.|ch_pump_hours|number|
|122|DHW pump / valve operation hours|n.a.|dhw_pump_hours|number|
|123|DHW burner operation hours|n.a.|dhw_burner_hours|number|
|124|OpenTherm version Master|n.a.|otver_master|number|
|125|OpenTherm version Slave|n.a.|otver_slave|number|
|126|Master-version|n.a.|master_product_type|number|
||||master_product_version|number|
|127|Slave-version|n.a.|slave_product_type|number|
||||slave_product_version|number|
|131|Remeha dF-/dU-codes|n.a.|remeha_df_code|number|
||||remeha_du_code|number|
|132|Remeha service message|n.a.|remeha_service_required|None/Type A/Type B/Type C|
|133|Remeha detection connected SCU’s|n.a.|remeha_scu_part1|number|
||||remeha_scu_part2|number|
