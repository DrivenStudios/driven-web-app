import React, { useCallback, useContext, type ReactElement, type ReactNode } from 'react';
import type { GenericFormValues } from '@jwp/ott-common/types/form';
import useOpaqueId from '@jwp/ott-hooks-react/src/useOpaqueId';

import Button from '../Button/Button';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';

import styles from './Form.module.scss';
import { FormContext } from './Form';

export interface FormSectionContentArgs<T extends GenericFormValues, TErrors> {
  values: T;
  isEditing: boolean;
  isBusy: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  errors?: TErrors | undefined;
}

export interface FormSectionProps<TData extends GenericFormValues, TErrors> {
  className?: string;
  panelHeaderClassName?: string;
  label: string;
  editButton?: string | ReactElement;
  saveButton?: string;
  cancelButton?: string;
  onSubmit?: (values: TData) => Promise<{ errors?: string[] }>;
  content?: (args: FormSectionContentArgs<TData, TErrors>) => ReactNode;
  children?: never;
  readOnly?: boolean;
}

export function FormSection<TData extends GenericFormValues>({
  className,
  panelHeaderClassName,
  label,
  editButton,
  saveButton,
  cancelButton,
  onSubmit,
  content,
  readOnly = false,
}: FormSectionProps<TData, string[]>): ReactElement<FormSectionProps<TData, string[]>> | null {
  const sectionId = useOpaqueId(label);
  const {
    formState: { values, activeSectionId, errors: formErrors, isBusy },
    setFormState,
    isLoading,
    onCancel,
  } = useContext(FormContext) as FormContext<TData>;

  const isEditing = sectionId === activeSectionId;

  const onChange = useCallback(
    ({ currentTarget }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!currentTarget) return;

      const { name, type } = currentTarget;
      const value = type === 'checkbox' ? (currentTarget as HTMLInputElement).checked : currentTarget.value;

      if (!isEditing) {
        onCancel();
      }

      setFormState((oldState) => {
        const newValues = { ...oldState.values };

        // This logic handles nested names like 'consents.terms'
        name.split('.').reduce((parent, field, index, arr) => {
          if (index === arr.length - 1) {
            parent[field] = value;
          } else {
            parent[field] = { ...parent[field] };
          }

          return parent[field];
        }, newValues);

        return {
          ...oldState,
          values: newValues,
          activeSectionId: sectionId,
        };
      });
    },
    [isEditing, onCancel, sectionId, setFormState],
  );

  const handleSubmit = useCallback(
    async function handleSubmit(event?: React.FormEvent) {
      event?.preventDefault();

      if (onSubmit) {
        let response: { errors?: string[] };

        try {
          setFormState((s) => {
            return { ...s, isBusy: true, errors: [] };
          });
          response = await onSubmit(values);
        } catch (error: unknown) {
          response = { errors: Array.of(error instanceof Error ? error.message : (error as string)) };
        }

        // Don't leave edit mode if there are errors
        if (response?.errors?.length) {
          setFormState((s) => {
            return {
              ...s,
              errors: response?.errors,
              isBusy: false,
            };
          });

          return;
        }
      }

      setFormState((s) => {
        return {
          ...s,
          activeSectionId: undefined,
          isBusy: false,
        };
      });
    },
    [onSubmit, setFormState, values],
  );

  const onEdit = useCallback(
    function onEdit() {
      if (!isEditing) {
        onCancel();
        setFormState((s) => {
          return {
            ...s,
            activeSectionId: sectionId,
          };
        });
      }
    },
    [isEditing, onCancel, sectionId, setFormState],
  );

  return (
    <section aria-labelledby={sectionId} className={className}>
      <div className={panelHeaderClassName}>
        <h2 id={sectionId}>{label}</h2>
      </div>
      {isBusy && isEditing && <LoadingOverlay transparentBackground />}
      {content && (
        <form className={styles.flexBox} noValidate onSubmit={(event) => event.preventDefault()}>
          {content({
            values,
            isEditing,
            isBusy,
            onChange,
            ...(isEditing ? { errors: formErrors } : {}),
          })}
        </form>
      )}
      {(saveButton || editButton || cancelButton) && (
        <div className={styles.controls}>
          {isEditing ? (
            <>
              {saveButton && <Button label={saveButton} type="submit" onClick={handleSubmit} disabled={isLoading} />}
              {cancelButton && <Button label={cancelButton} type="reset" variant="text" onClick={onCancel} />}
            </>
          ) : (
            !readOnly &&
            editButton &&
            (typeof editButton === 'object' ? (
              (editButton as ReactElement)
            ) : (
              <Button label={editButton as string} type="button" onClick={onEdit} disabled={isLoading} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
