import React from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '../TextField/TextField';

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  value?: string;
};

const CreditCardExpiryField: React.FC<Props> = ({ value, onChange, error, ...props }: Props) => {
  const { t } = useTranslation('account');
  const formatExpirationDate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let clearValue = e.target.value.replace(/\D+/g, '');

    if (clearValue.length === 1) {
      if (Number(clearValue) > 1) {
        clearValue = '0' + clearValue;
      }
    } else if (clearValue.length === 2) {
      if (Number(clearValue) > 12) {
        clearValue = '12';
      }
    }

    if (clearValue.length >= 3) {
      e.target.value = `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    } else {
      e.target.value = clearValue;
    }
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <TextField
      label={t('payment.credit_card_expiry_date')}
      {...props}
      name="cardExpiry"
      className="directPostExpiryDate"
      value={value}
      error={!!error}
      helperText={error ? error : null}
      onChange={formatExpirationDate}
      type="text"
      pattern="\d*"
      placeholder="MM/YY"
      autoComplete="cc-exp"
      required
    />
  );
};

export default CreditCardExpiryField;
