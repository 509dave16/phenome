import Utils from './utils/utils';
import Mixins from './utils/mixins';

const CheckboxProps = Utils.extend({
  checked: Boolean,
  name: [Number, String],
  value: [Number, String, Boolean],
  disabled: Boolean,
  readonly: Boolean,
}, Mixins.colorProps);

export default {
  name: 'f7-checkbox',
  props: CheckboxProps,
  render(c) {
    const self = this;
    const { name, value, disabled, readonly, checked } = self;

    const inputEl = (
      <input
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        readonly={readonly}
        checked={checked}
        onChange={self.onChange.bind(self)}
      />
    )
    const iconEl = (<i className="icon-checkbox"></i>)

    return (
      <label id={self.props.id} style={self.props.style} className={classes}>
        {inputEl}
        {iconEl}
        <slot></slot>
      </label>
    )
  },
  computed: {
    classes() {
      const self = this;
      return Utils.classNames(
        self.props.className,
        {
          checkbox: true,
          disabled: self.disabled,
        },
        Mixins.colorClasses(self)
      );
    },
  },
  methods: {
    onChange(event) {
      this.dispatchEvent('change', event);
    },
  },
};
