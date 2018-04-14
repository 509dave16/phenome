import Utils from './utils/utils';
import Mixins from './utils/mixins';

export default {
  props: Mixins.colorProps,
  name: 'f7-accordion-toggle',
  render() {
    return (
      <div id={this.props.id} style={this.props.style} className={this.classes}>
        <slot />
      </div>
    );
  },
  computed: {
    classes() {
      const self = this;
      return Utils.classNames(
        self.props.className,
        {
          'accordion-item-toggle': true,
        },
        Mixins.colorClasses(self),
      );
    },
  },
};
