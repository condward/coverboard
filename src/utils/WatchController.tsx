import { JSX, ReactElement } from 'react';
import { useWatch, Controller } from 'react-hook-form';
import type {
  FieldValues,
  FieldPath,
  ControllerRenderProps,
  UseFormStateReturn,
  FieldPathValue,
  UseControllerProps,
  ControllerFieldState,
} from 'react-hook-form';

export type WatchControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TWatchName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  watch: TWatchName;
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
    watched: FieldPathValue<TFieldValues, TWatchName>;
  }) => ReactElement;
} & UseControllerProps<TFieldValues, TName>;

const WatchController: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TWatchName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: WatchControllerProps<TFieldValues, TName, TWatchName>,
) => JSX.Element = ({ watch, control, render, ...props }) => {
  const watched = useWatch({ control, name: watch });

  return (
    <Controller
      {...props}
      control={control}
      render={(values) => render({ ...values, watched })}
    />
  );
};

export default WatchController;
