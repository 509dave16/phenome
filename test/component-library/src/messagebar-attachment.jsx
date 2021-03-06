import Utils from './utils/utils';
import Mixins from './utils/mixins';

export default {
  name: 'f7-messagebar-attachment',
  props: {
    image: String,
    deletable: {
      type: Boolean,
      default: true,
    },
    ...Mixins.colorProps,
  },
  componentDidCreate() {
    this.onClickBound = this.onClick.bind(this);
    this.onDeleteClickBound = this.onDeleteClick.bind(this);
  },
  render() {
    const self = this;
    const {
      deletable,
      image,
      className,
      id,
      style,
    } = self.props;
    const classes = Utils.classNames(
      className,
      'messagebar-attachment',
      Mixins.colorClasses(self),
    );

    return (
      <div id={id} style={style} className={classes} onClick={self.onClickBound}>
        {image &&
          <img src={image} />}
        {deletable &&
          <span className="messagebar-attachment-delete" onClick={self.onDeleteClickBound} />
        }
        <slot />
      </div>
    );
  },
  methods: {
    onClick(e) {
      this.dispatchEvent('attachment:click attachmentClick', e);
    },
    onDeleteClick(e) {
      this.dispatchEvent('attachment:delete attachmentDelete', e);
    },
  },
};
