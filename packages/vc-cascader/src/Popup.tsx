import PopupPicker from 'packages/vc-picker/src/Popup'
import { IPopupPickerProps } from 'packages/vc-picker/src/PopupPickerTypes'
import { CascaderValue } from './CascaderTypes'
import { FunctionalComponent } from 'vue'

export interface IPopupCascaderProps extends IPopupPickerProps {
  cascader: any
  onChange?: (date?: CascaderValue) => void
}

const PopupCascader: FunctionalComponent<IPopupCascaderProps> = (
  props,
  { emit, slots }
) => (
  <PopupPicker
    picker={props.cascader}
    {...props}
    onOk={(v) => {
      emit('ok', v)
      emit('change', v)
    }}
  >
    {slots.default?.()}
  </PopupPicker>
)

export default PopupCascader
