import { defineComponent, PropType, ref } from 'vue'
import { Icon } from '../../shared/Icon'
import { Time } from '../../shared/time'
import { DatetimePicker, Popup } from 'vant'
import s from './InputPad.module.scss'
import { number } from 'echarts'
export const InputPad = defineComponent({
  props: {
    happenAt: String,
    amount: Number,
    onSubmit: {
      type: Function as PropType<() => void>,
    },
  },
  setup: (props, context) => {
    const appendText = (n: number | string) => {
      const nString = n.toString()
      const dotIndex = refAmount.value.indexOf('.')
      if (refAmount.value.length >= 10) {
        return
      }
      if (dotIndex >= 0 && refAmount.value.length - dotIndex > 2) {
        return
      }
      if (nString === '.') {
        if (dotIndex >= 0) {
          // 已经有小数点了
          return
        }
      } else if (nString === '0') {
        if (refAmount.value.indexOf('0') >= 0 && refAmount.value.length <= 1) {
          //没小数点但是有0
          return
        }
      } else {
        if (refAmount.value === '0') {
          refAmount.value = ''
        }
      }
      refAmount.value += n.toString()
    }
    const buttons = [
      {
        text: '1',
        onClick: () => {
          appendText(1)
        },
      },
      {
        text: '2',
        onClick: () => {
          appendText(2)
        },
      },
      {
        text: '3',
        onClick: () => {
          appendText(3)
        },
      },
      {
        text: '4',
        onClick: () => {
          appendText(4)
        },
      },
      {
        text: '5',
        onClick: () => {
          appendText(5)
        },
      },
      {
        text: '6',
        onClick: () => {
          appendText(6)
        },
      },
      {
        text: '7',
        onClick: () => {
          appendText(7)
        },
      },
      {
        text: '8',
        onClick: () => {
          appendText(8)
        },
      },
      {
        text: '9',
        onClick: () => {
          appendText(9)
        },
      },
      {
        text: '.',
        onClick: () => {
          appendText('.')
        },
      },
      {
        text: '0',
        onClick: () => {
          appendText(0)
        },
      },
      {
        text: '清空',
        onClick: () => {
          refAmount.value = '0'
        },
      },
      {
        text: '提交',
        onClick: () => {
          context.emit('update:amount', parseFloat(refAmount.value) * 100)
          props.onSubmit?.()
        },
      },
    ]
    const refAmount = ref(props.amount ? (props.amount / 100).toString() : '0')
    const refDatePickerVisible = ref(false)
    const showDatePicker = () => (refDatePickerVisible.value = true)
    const hideDatePicker = () => (refDatePickerVisible.value = false)
    const setDate = (date: Date) => {
      context.emit('update:happenAt', date.toISOString())
      hideDatePicker()
    }
    return () => (
      <>
        <div class={s.dateAndAmount}>
          <span class={s.date}>
            <Icon class={s.icon} name="date" />
            <span>
              <span onClick={showDatePicker}>{new Time(props.happenAt).format()}</span>
              <Popup position="bottom" v-model:show={refDatePickerVisible.value}>
                <DatetimePicker
                  modelValue={props.happenAt ? new Date(props.happenAt) : new Date()}
                  type="date"
                  title="选择年月日"
                  onConfirm={setDate}
                  onCancel={hideDatePicker}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>{refAmount.value}</span>
        </div>
        <div class={s.buttons}>
          {buttons.map((button) => (
            <button onClick={button.onClick}>{button.text}</button>
          ))}
        </div>
      </>
    )
  },
})
