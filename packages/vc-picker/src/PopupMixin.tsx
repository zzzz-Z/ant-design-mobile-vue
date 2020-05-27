import { IPopupPickerProps } from './PopupPickerTypes'
import { defineComponent, reactive, watch, cloneVNode, ref, Events } from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'

export default function PopupMixin(getModal: any, platformProps = {}) {
  return defineComponent<IPopupPickerProps>({
    props: defineProps({
      picker: undefined,
      triggerType: String,
      WrapComponent: undefined,
      visible: Boolean,
      disabled: Boolean,
      content: undefined,
      wrapStyle: undefined,
      prefixCls: String,
      pickerValueProp: String,
      pickerValueChangeProp: String,
      transitionName: String,
      popupTransitionName: String,
      maskTransitionName: String,
      value: undefined,
      okText: 'Ok',
      dismissText: 'Dismiss',
      title: '',
      ...platformProps,
    }),
    setup(props, { slots, emit }) {
      let picker = ref<any>(null)
      const state = reactive({
        pickerValue: props.value,
        visible: props.visible || false,
      })

      watch(() => props.visible!, setVisibleState)

      watch(
        () => props.value,
        (val) => {
          state.pickerValue = val
        }
      )

      function setVisibleState(visible: boolean) {
        state.visible = visible
        if (!visible) {
          state.pickerValue = null
        }
      }

      function onPickerChange(pickerValue: any) {
        if (state.pickerValue !== pickerValue) {
          state.pickerValue = pickerValue

          const { picker, pickerValueChangeProp } = props
          if (picker && picker.props[pickerValueChangeProp!]) {
            picker.props[pickerValueChangeProp!](pickerValue)
          }
        }
      }

      function fireVisibleChange(visible: boolean) {
        if (state.visible !== visible) {
          setVisibleState(visible)
          emit('visibleChange', visible)
        }
      }

      function getContent() {
        if (props.picker) {
          let { pickerValue } = state
          if (pickerValue === null) {
            pickerValue = props.value
          }
          return cloneVNode(props.picker, {
            [props.pickerValueProp!]: pickerValue,
            [props.pickerValueChangeProp!]: onPickerChange,
            ref: picker,
          })
        } else {
          return props.content
        }
      }

      function onOk() {
        console.log(props.picker)
        emit('ok', picker && picker.getValue())
        fireVisibleChange(false)
      }
      function onDismiss() {
        emit('dismiss')
        fireVisibleChange(false)
      }

      function hide() {
        fireVisibleChange(false)
      }

      function onTriggerClick(e: Events['onClick']) {
        const child = slots.default?.()[0]
        const childProps = child?.props || {}
        if (childProps[props.triggerType!]) {
          childProps[props.triggerType!](e)
        }
        fireVisibleChange(!state.visible)
      }

      function getRender() {
        const children = slots.default?.()[0]
        if (!children) {
          return getModal(props, state.visible, {
            getContent,
            onOk,
            hide,
            onDismiss,
          })
        }
        const { WrapComponent, disabled } = props
        const child = children
        const newChildProps: any = {}
        if (!disabled) {
          newChildProps[props.triggerType!] = onTriggerClick
        }
        return (
          <WrapComponent style={props.wrapStyle}>
            {cloneVNode(child, newChildProps)}
            {getModal(props, state.visible, {
              getContent: getContent,
              onOk: onOk,
              hide: hide,
              onDismiss: onDismiss,
            })}
          </WrapComponent>
        )
      }

      return getRender
    },
  })
}
