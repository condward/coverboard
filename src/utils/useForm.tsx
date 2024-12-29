import type { FieldValues, UseFormProps } from 'react-hook-form';
import { useForm as useReactHookForm } from 'react-hook-form';

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props?: UseFormProps<TFieldValues, TContext>) {
  return useReactHookForm<TFieldValues, TContext, TTransformedValues>({
    mode: 'onChange',
    ...props,
  });
}
