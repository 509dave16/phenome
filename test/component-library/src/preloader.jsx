import Utils from './utils/utils';
import Mixins from './utils/mixins';

const PreloaderProps = Utils.extend({
  size: [Number, String],
}, Mixins.colorProps);

export default {
  name: 'f7-preloader',
  props: PreloaderProps,
  render() {
    const { classes, sizeComputed } = this;
    const { id, style } = this.props;

    const preloaderStyle = {};
    if (sizeComputed) {
      preloaderStyle.width = `${sizeComputed}px`;
      preloaderStyle.height = `${sizeComputed}px`;
    }
    if (style) Utils.extend(preloaderStyle, style || {});

    let innerEl;
    if (this.$theme.md) {
      innerEl = (
        <span class="preloader-inner">
          <span class="preloader-inner-gap"></span>
          <span class="preloader-inner-left">
            <span class="preloader-inner-half-circle"></span>
          </span>
          <span class="preloader-inner-right">
            <span class="preloader-inner-half-circle"></span>
          </span>
        </span>
      );
    }
    return (
      <span id={id} style={preloaderStyle} className={classes}>
        {innerEl}
      </span>
    );
  },
  computed: {
    classes() {
      return Utils.classNames(
        this.props.className,
        'preloader',
        Mixins.colorClasses(this),
      );
    },
    sizeComputed() {
      let s = this.props.size;
      if (s && typeof s === 'string' && s.indexOf('px') >= 0) {
        s = s.replace('px', '');
      }
      return s;
    },
  },
};
