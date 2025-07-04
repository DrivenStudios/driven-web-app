import React from 'react';
import { useTranslation } from 'react-i18next';
import type { CleengCaptureField, CleengCaptureQuestionField, PersonalDetailsFormData } from '@jwp/ott-common/types/account';
import { testId } from '@jwp/ott-common/src/utils/common';
import useForm, { type UseFormOnSubmitHandler } from '@jwp/ott-hooks-react/src/useForm';

import TextField from '../form-fields/TextField/TextField';
import Button from '../Button/Button';
import Dropdown from '../form-fields/Dropdown/Dropdown';
import Checkbox from '../form-fields/Checkbox/Checkbox';
import Radio from '../form-fields/Radio/Radio';
import DateField from '../form-fields/DateField/DateField';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import FormFeedback from '../FormFeedback/FormFeedback';

import styles from './PersonalDetailsForm.module.scss';

type Props = {
  initialValues: PersonalDetailsFormData;
  onSubmit: UseFormOnSubmitHandler<PersonalDetailsFormData>;
  error?: string;
  fields: Record<string, CleengCaptureField>;
  questions: CleengCaptureQuestionField[];
  onQuestionChange: React.ChangeEventHandler;
  questionValues: Record<string, string>;
  questionErrors: Record<string, string>;
};

const PersonalDetailsForm: React.FC<Props> = ({ initialValues, onSubmit, fields, questions, onQuestionChange, questionValues, questionErrors }: Props) => {
  const { t } = useTranslation('account');

  const { setValue, handleSubmit, handleChange, values, errors, validationSchemaError, submitting } = useForm<PersonalDetailsFormData>({
    initialValues,
    onSubmit,
  });

  const renderQuestion = ({ value, key, question, required, enabled }: CleengCaptureQuestionField) => {
    if (!enabled) {
      return null;
    }

    const values = value?.split(';').map((question) => {
      const [value, label = value] = question.split(':');

      return { value, label };
    });

    const props = {
      name: key,
      onChange: onQuestionChange,
      error: !!questionErrors[key],
      helperText: questionErrors[key],
      required,
    };

    // The rendered field is determined by the given available options for each question:
    // TextField <- when there is exactly 1 option and the value is empty (e.g. "")
    // Checkbox  <- when there is exactly 1 option and the value is not empty (e.g. "accepted")
    // Radio     <- when there are exactly 2 options
    // Dropdown  <- when there are more than 2 options

    if (values.length === 1 && values[0].value === '') {
      return <TextField value={questionValues[key]} label={question} key={key} {...props} />;
    } else if (values.length === 1) {
      return <Checkbox checked={!!questionValues[key]} value={values[0].value} label={question} checkboxLabel={values[0].label} key={key} {...props} />;
    } else if (values.length === 2) {
      return <Radio values={values} value={questionValues[key]} label={question} key={key} {...props} />;
    } else if (values.length > 2) {
      return <Dropdown options={values} value={questionValues[key]} label={question} defaultLabel={t('personal_details.select_answer')} key={key} {...props} />;
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} data-testid={testId('personal_details-form')} noValidate>
      <h2 className={styles.title}>{t('personal_details.title')}</h2>
      {errors.form ? (
        <FormFeedback variant="error" visible={!validationSchemaError}>
          {errors.form}
        </FormFeedback>
      ) : null}
      {fields.firstNameLastName?.enabled ? (
        <React.Fragment>
          <TextField
            value={values.firstName}
            onChange={handleChange}
            label={t('personal_details.fist_name')}
            placeholder={t('personal_details.fist_name')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required={fields.firstNameLastName.required}
            name="firstName"
            autoComplete="given-name"
          />
          <TextField
            value={values.lastName}
            onChange={handleChange}
            label={t('personal_details.last_name')}
            placeholder={t('personal_details.last_name')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required={fields.firstNameLastName.required}
            name="lastName"
            autoComplete="family-name"
          />
        </React.Fragment>
      ) : null}
      {fields.companyName?.enabled ? (
        <TextField
          value={values.companyName}
          onChange={handleChange}
          label={t('personal_details.company_name')}
          placeholder={t('personal_details.company_name')}
          error={!!errors.companyName}
          helperText={errors.companyName}
          required={fields.companyName.required}
          name="companyName"
          autoComplete="organization"
        />
      ) : null}
      {fields.address?.enabled ? (
        <React.Fragment>
          <TextField
            value={values.address}
            onChange={handleChange}
            label={t('personal_details.address')}
            placeholder={t('personal_details.address')}
            error={!!errors.address}
            helperText={errors.address}
            required={fields.address.required}
            name="address"
            autoComplete="address-line1"
          />
          <TextField
            value={values.address2}
            onChange={handleChange}
            label={t('personal_details.address2')}
            placeholder={t('personal_details.address2')}
            error={!!errors.address2}
            helperText={errors.address2}
            name="address2"
            autoComplete="address-line2"
          />
          <TextField
            value={values.city}
            onChange={handleChange}
            label={t('personal_details.city')}
            placeholder={t('personal_details.city')}
            error={!!errors.city}
            helperText={errors.city}
            required={fields.address.required}
            name="city"
            autoComplete="address-level2"
          />
          <TextField
            value={values.state}
            onChange={handleChange}
            label={t('personal_details.state')}
            placeholder={t('personal_details.state')}
            error={!!errors.state}
            helperText={errors.state}
            required={fields.address.required}
            name="state"
            autoComplete="address-level1"
          />
          <TextField
            value={values.postCode}
            onChange={handleChange}
            label={t('personal_details.post_code')}
            placeholder={t('personal_details.post_code')}
            error={!!errors.postCode}
            helperText={errors.postCode}
            required={fields.address.required}
            name="postCode"
            autoComplete="postal-code"
          />
        </React.Fragment>
      ) : null}
      {fields.phoneNumber?.enabled ? (
        <TextField
          value={values.phoneNumber}
          onChange={handleChange}
          label={t('personal_details.phone_number')}
          placeholder={t('personal_details.phone_number')}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          required={fields.phoneNumber.required}
          name="phoneNumber"
        />
      ) : null}
      {fields.birthDate?.enabled ? (
        <DateField
          value={values.birthDate}
          onChange={(event) => setValue('birthDate', event.currentTarget.value)}
          label={t('personal_details.birth_date')}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          required={fields.birthDate.required}
          name="birthDate"
        />
      ) : null}
      {questions.map((question) => renderQuestion(question))}
      <Button
        className={styles.continue}
        type="submit"
        label={t('personal_details.continue')}
        variant="contained"
        color="primary"
        size="large"
        disabled={submitting}
        fullWidth
      />
      {submitting && <LoadingOverlay transparentBackground inline />}
    </form>
  );
};

export default PersonalDetailsForm;
