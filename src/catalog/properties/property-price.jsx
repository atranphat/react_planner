import React from 'react';
import PropTypes from 'prop-types';
import {CURRENCY, CURRENCY_EURO} from './../../constants';
import { FormLabel, FormNumberInput, FormSelect } from '../../components/style/export';
import {Map} from 'immutable';
import {toFixedFloat} from '../../utils/math';
import PropertyStyle from './shared-property-style';

const internalTableStyle = {borderCollapse: 'collapse'};
const secondTdStyle = {padding: 0};
const currencyContainerStyle = {width: '5em'};

export default function PropertyPrice({value, onUpdate, onValid, configs, sourceElement, internalState, state}) {

  let price = value.get('price') || 0;
  let _price = value.get('_price') || price;
  let _currency = value.get('_currency') || CURRENCY_EURO;
  let { hook, label, ...configRest} = configs;

  let update = (priceInput, unitInput) => {

    let merged = value.merge({
      price: toFixedFloat(priceInput),
      _price: priceInput,
      _currency: unitInput
    });

    if (hook) {
      return hook(merged, sourceElement, internalState, state).then(val => {
        return onUpdate(val);
      });
    }

    return onUpdate(merged);
  };

  return (
    <table className="PropertyPrice" style={PropertyStyle.tableStyle}>
      <tbody>
      <tr>
        { label && <td style={PropertyStyle.firstTdStyle}><FormLabel>{label}</FormLabel></td> }
        <td style={secondTdStyle}>
          <table style={internalTableStyle}>
            <tbody>
            <tr>
              <td>
                <FormNumberInput
                  value={_price}
                  onChange={event => update(event.target.value, _currency)}
                  onValid={onValid}
                  {...configRest}
                />
              </td>
              <td style={currencyContainerStyle}>
                <FormSelect value={_currency} onChange={event => update(_price, event.target.value) }>
                  {
                    CURRENCY.map(el => <option key={el} value={el}>{el}</option>)
                  }
                </FormSelect>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>
  );

}

PropertyPrice.propTypes = {
  value: PropTypes.instanceOf(Map).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired
};

PropertyPrice.contextTypes = {
  catalog: PropTypes.object.isRequired
};
