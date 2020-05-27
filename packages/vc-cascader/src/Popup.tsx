import PopupPicker from 'packages/vc-picker/src/Popup'
import { IPopupPickerProps } from 'packages/vc-picker/src/PopupPickerTypes'
import { CascaderValue } from './CascaderTypes'
import { defineComponent } from 'vue'

export interface IPopupCascaderProps extends IPopupPickerProps {
  cascader: any
  onChange?: (date?: CascaderValue) => void
}

const PopupCascader = defineComponent({
  setup(_, { attrs, emit, slots }) {
    return () => (
      <PopupPicker
        picker={attrs.cascader}
        {...attrs}
        onOk={(v) => {
          emit('ok', v)
          emit('change', v)
        }}
      >
        {slots.default?.()}
      </PopupPicker>
    )
  },
})

export default PopupCascader
