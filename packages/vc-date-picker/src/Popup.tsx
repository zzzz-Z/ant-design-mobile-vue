import { VCPopup, IPopupPickerProps } from 'packages/vc-picker'
import { FunctionalComponent } from 'vue'

export interface IPopupDatePickerProps extends IPopupPickerProps {
  datePicker: any
  onChange?: (date?: any) => void
  date?: any
}

const PopupDatePicker: FunctionalComponent<IPopupDatePickerProps> = (
  props,
  { slots }
) => {
  return (
    <VCPopup
      picker={props.datePicker}
      value={props.date}
      {...props}
      onOk={(v) => {
        props.onChange?.(v)
        props.onOk?.(v)
      }}
    >
      {slots.default?.()}
    </VCPopup>
  )
}
export default PopupDatePicker
