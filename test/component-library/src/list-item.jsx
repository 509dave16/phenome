import Utils from './utils/utils';
import F7ListItemContent from './list-item-content';
import Mixins from './utils/mixins';

const ListItemProps = Utils.extend(
  {
    title: [String, Number],
    text: [String, Number],
    media: String,
    subtitle: [String, Number],
    header: [String, Number],
    footer: [String, Number],

    // Link Props
    link: [Boolean, String],
    target: String,
    noFastclick: Boolean,
    noFastClick: Boolean,

    after: [String, Number],
    badge: [String, Number],
    badgeColor: String,

    mediaItem: Boolean,
    mediaList: Boolean,
    divider: Boolean,
    groupTitle: Boolean,
    swipeout: Boolean,
    sortable: Boolean,
    accordionItem: Boolean,
    accordionItemOpened: Boolean,

    // Smart Select
    smartSelect: Boolean,
    smartSelectParams: Object,

    // Inputs
    checkbox: Boolean,
    radio: Boolean,
    checked: Boolean,
    name: String,
    value: [String, Number, Array],
    readonly: Boolean,
    required: Boolean,
    disabled: Boolean,
    itemInput: Boolean,
    itemInputWithInfo: Boolean,
    inlineLabel: Boolean,
  },
  Mixins.colorProps,
  Mixins.linkRouterProps,
  Mixins.linkActionsProps,
);

export default {
  name: 'f7-list-item',
  props: ListItemProps,
  render() {
    const self = this;

    let liChildren;
    let linkEl;
    let itemContentEl;

    const {
      title,
      text,
      media,
      subtitle,
      header,
      footer,
      link,
      href,
      target,
      noFastclick,
      noFastClick,
      after,
      badge,
      badgeColor,
      mediaItem,
      mediaList,
      divider,
      groupTitle,
      swipeout,
      sortable,
      accordionItem,
      accordionItemOpened,
      smartSelect,
      checkbox,
      radio,
      checked,
      name,
      value,
      readonly,
      required,
      disabled,
      itemInput,
      itemInputWithInfo,
      inlineLabel,
    } = self.props;

    if (!self.simpleListComputed) {
      // Item Content
      const needsEvents = !(link || href || accordionItem || smartSelect);

      itemContentEl = (
        <F7ListItemContent
          title={title}
          text={text}
          media={media}
          subtitle={subtitle}
          after={after}
          header={header}
          footer={footer}
          badge={badge}
          badgeColor={badgeColor}
          mediaList={self.mediaListComputed}
          accordionItem={accordionItem}
          checkbox={checkbox}
          checked={checked}
          radio={radio}
          name={name}
          value={value}
          readonly={readonly}
          required={required}
          disabled={disabled}
          itemInput={itemInput || self.itemInputForced}
          itemInputWithInfo={itemInputWithInfo || self.itemInputWithInfoForced}
          inlineLabel={inlineLabel || self.inlineLabelForced}
          onClick={needsEvents ? self.onClickBound : null} // phenome-react-line
          onChange={needsEvents ? self.onChangeBound : null} // phenome-react-line
          // phenome-vue-next-line
          on={needsEvents ? { click: self.onClickBound, change: self.onChangeBound } : undefined}
        >
          <slot name="content-start" />
          <slot name="content" />
          <slot name="content-end" />
          <slot name="media" />
          <slot name="inner-start" />
          <slot name="inner" />
          <slot name="inner-end" />
          <slot name="after-start" />
          <slot name="after" />
          <slot name="after-end" />
          <slot name="header" />
          <slot name="footer" />
          <slot name="before-title" />
          <slot name="title" />
          <slot name="after-title" />
          <slot name="subtitle" />
          <slot name="text" />
          {swipeout || accordionItem ? null : self.slots.default}
        </F7ListItemContent>
      );

      // Link
      if (link || href || accordionItem || smartSelect) {
        const linkAttrs = Utils.extend(
          {
            href: link === true || accordionItem || smartSelect ? '#' : link || href,
            target,
          },
          Mixins.linkRouterAttrs(self),
          Mixins.linkActionsAttrs(self),
        );
        const linkClasses = Utils.classNames(
          {
            'item-link': true,
            'no-fastclick': noFastclick || noFastClick,
            'smart-select': smartSelect,
          },
          Mixins.linkRouterClasses(self),
          Mixins.linkActionsClasses(self),
        );
        linkEl = (
          <a
            className={linkClasses}
            onClick={self.onClick.bind(self)}
            {...linkAttrs}
          >
            {itemContentEl}
          </a>
        );
      }
    }

    const liClasses = Utils.classNames(
      self.props.className,
      {
        'item-divider': divider,
        'list-group-title': groupTitle,
        'media-item': mediaItem || mediaList,
        swipeout,
        'accordion-item': accordionItem,
        'accordion-item-opened': accordionItemOpened,
      },
      Mixins.colorClasses(self),
    );
    if (divider || groupTitle) {
      return (
        <li ref="el" id={self.props.id} style={self.props.style} className={liClasses}>
          <span><slot>{title}</slot></span>
        </li>
      );
    } else if (self.simpleListComputed) {
      return (
        <li ref="el" id={self.props.id} style={self.props.style} className={liClasses}>
          {title}
          <slot name="default" />
        </li>
      );
    }

    const linkItemEl = (link || href || smartSelect || accordionItem) ? linkEl : itemContentEl;
    return (
      <li ref="el" id={self.props.id} style={self.props.style} className={liClasses}>
        <slot name="root-start" />
        {swipeout ? (
          <div className="swipeout-content">{linkItemEl}</div>
        ) :
          linkItemEl
        }
        {self.sortableComputed && (<div className="sortable-handler" />)}
        {(swipeout || accordionItem) && self.slots.default}
        <slot name="root" />
        <slot name="root-end" />
      </li>
    );
  },
  state() {
    return {
      itemInputForced: false,
      inlineLabelForced: false,
      itemInputWithInfoForced: false,
    };
  },
  computed: {
    // TODO set forced/computed !
    // sortableComputed() {
    //   return this.sortable || this.$parent.sortable || this.$parent.sortableComputed;
    // },
    // mediaListComputed() {
    //   return this.mediaList || this.mediaItem || this.$parent.mediaList || this.$parent.mediaListComputed;
    // },
    // simpleListComputed() {
    //   return this.simpleList || this.$parent.simpleList || (this.$parent.$parent && this.$parent.simpleList);
    // },
  },
  componentDidCreate() {
    const self = this;
    self.onClickBound = self.onClick.bind(self);
    self.onChangeBound = self.onChange.bind(self);
    self.onSwipeoutOpenBound = self.onSwipeoutOpen.bind(self);
    self.onSwipeoutOpenedBound = self.onSwipeoutOpened.bind(self);
    self.onSwipeoutCloseBound = self.onSwipeoutClose.bind(self);
    self.onSwipeoutClosedBound = self.onSwipeoutClosed.bind(self);
    self.onSwipeoutDeleteBound = self.onSwipeoutDelete.bind(self);
    self.onSwipeoutDeletedBound = self.onSwipeoutDeleted.bind(self);
    self.onSwipeoutBound = self.onSwipeout.bind(self);
    self.onAccOpenBound = self.onAccOpen.bind(self);
    self.onAccOpenedBound = self.onAccOpened.bind(self);
    self.onAccCloseBound = self.onAccClose.bind(self);
    self.onAccClosedBound = self.onAccClosed.bind(self);
  },
  componentDidMount() {
    const self = this;
    const el = self.refs.el;
    if (!el) return;

    el.addEventListener('swipeout:open', self.onSwipeoutOpenBound);
    el.addEventListener('swipeout:opened', self.onSwipeoutOpenedBound);
    el.addEventListener('swipeout:close', self.onSwipeoutCloseBound);
    el.addEventListener('swipeout:closed', self.onSwipeoutClosedBound);
    el.addEventListener('swipeout:delete', self.onSwipeoutDeleteBound);
    el.addEventListener('swipeout:deleted', self.onSwipeoutDeletedBound);
    el.addEventListener('swipeout', self.onSwipeoutBound);
    el.addEventListener('accordion:open', self.onAccOpenBound);
    el.addEventListener('accordion:opened', self.onAccOpenedBound);
    el.addEventListener('accordion:close', self.onAccCloseBound);
    el.addEventListener('accordion:closed', self.onAccClosedBound);

    if (!self.props.smartSelect) return;
    self.$f7ready((f7) => {
      const smartSelectParams = Utils.extend(
        { el: el.querySelector('a.smart-select') },
        self.props.smartSelectParams || {},
      );
      self.f7SmartSelect = f7.smartSelect.create(smartSelectParams);
    });
  },
  componentWillUnmount() {
    const self = this;
    const el = self.refs.el;
    if (el) {
      el.removeEventListener('swipeout:open', self.onSwipeoutOpenBound);
      el.removeEventListener('swipeout:opened', self.onSwipeoutOpenedBound);
      el.removeEventListener('swipeout:close', self.onSwipeoutCloseBound);
      el.removeEventListener('swipeout:closed', self.onSwipeoutClosedBound);
      el.removeEventListener('swipeout:delete', self.onSwipeoutDeleteBound);
      el.removeEventListener('swipeout:deleted', self.onSwipeoutDeletedBound);
      el.removeEventListener('swipeout', self.onSwipeoutBound);
      el.removeEventListener('accordion:open', self.onAccOpenBound);
      el.removeEventListener('accordion:opened', self.onAccOpenedBound);
      el.removeEventListener('accordion:close', self.onAccCloseBound);
      el.removeEventListener('accordion:closed', self.onAccClosedBound);
    }
    if (self.props.smartSelect && self.f7SmartSelect) {
      self.f7SmartSelect.destroy();
    }
  },
  methods: {
    onClick(event) {
      const self = this;
      if (self.props.smartSelect && self.f7SmartSelect) {
        self.f7SmartSelect.open();
      }
      if (event.target.tagName.toLowerCase() !== 'input') {
        self.dispatchEvent('click', event);
      }
    },
    onSwipeoutDeleted(event) {
      this.dispatchEvent('swipeout:deleted swipeoutDeleted', event);
    },
    onSwipeoutDelete(event) {
      this.dispatchEvent('swipeout:delete swipeoutDelete', event);
    },
    onSwipeoutClose(event) {
      this.dispatchEvent('swipeout:close swipeoutClose', event);
    },
    onSwipeoutClosed(event) {
      this.dispatchEvent('swipeout:closed swipeoutClosed', event);
    },
    onSwipeoutOpen(event) {
      this.dispatchEvent('swipeout:open swipeoutOpen', event);
    },
    onSwipeoutOpened(event) {
      this.dispatchEvent('swipeout:opened swipeoutOpened', event);
    },
    onSwipeout(event) {
      this.dispatchEvent('swipeout', event);
    },
    onAccClose(event) {
      this.dispatchEvent('accordion:close accordionClose', event);
    },
    onAccClosed(event) {
      this.dispatchEvent('accordion:closed accordionClosed', event);
    },
    onAccOpen(event) {
      this.dispatchEvent('accordion:open accordionOpen', event);
    },
    onAccOpened(event) {
      this.dispatchEvent('accordion:opened accordionOpened', event);
    },
    onChange(event) {
      this.dispatchEvent('change', event);
    },
    onInput(event) {
      this.dispatchEvent('input', event);
    },
  },
};
