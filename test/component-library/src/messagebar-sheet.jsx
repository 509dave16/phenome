import Utils from './utils/utils';
import Mixins from './utils/mixins';

export default {
  name: 'f7-messagebar-sheet',
  props: Mixins.colorProps,
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
      return Utils.className(
        'messagebar-sheet',
        self.props.className,
        Mixins.colorClasses(self),
      );
    },
  },
};

