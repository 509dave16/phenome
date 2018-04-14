import Utils from './utils/utils';
import Mixins from './utils/mixins';

const ProgressbarProps = Utils.extend({
  progress: Number,
  infinite: Boolean,
}, Mixins.colorProps);

export default {
  name: 'f7-progressbar',
  props: ProgressbarProps,
  render() {
    const self = this;
    const { progress, id, style } = self.props;
    const transformStyle = {
      transform: progress ? `translate3d(${-100 + progress}%, 0, 0)` : '',
      webkitTransform: progress ? `translate3d(${-100 + progress}%, 0, 0)` : '',
    };
    return (
      <span
        ref="el"
        id={id}
        style={style}
        className={self.classes}
        data-progress={progress}
      >
        <span style={transformStyle} />
      </span>
    );
  },
  computed: {
    classes() {
      return Utils.classNames(
        this.props.className,
        {
          progressbar: true,
          'progressbar-infinite': this.props.infinite,
        },
        Mixins.colorClasses(this),
      );
    },
  },
  methods: {
    set(progress, speed) {
      const self = this;
      if (!self.$f7) return;
      self.$f7.progressbar.set(self.refs.el, progress, speed);
    },
  },
};
