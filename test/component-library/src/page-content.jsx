import Utils from './utils/utils';
import Mixins from './utils/mixins';

const PageContentProps = Utils.extend({
  tab: Boolean,
  tabActive: Boolean,
  ptr: Boolean,
  ptrDistance: Number,
  ptrPreloader: {
    type: Boolean,
    default: true,
  },
  infinite: Boolean,
  infiniteTop: Boolean,
  infiniteDistance: Number,
  infinitePreloader: {
    type: Boolean,
    default: true,
  },
  hideBarsOnScroll: Boolean,
  hideNavbarOnScroll: Boolean,
  hideToolbarOnScroll: Boolean,
  messagesContent: Boolean,
  loginScreen: Boolean,
}, Mixins.colorProps);

export default {
  name: 'f7-page-content',
  props: PageContentProps,
  render() {
    const self = this;

    let ptrEl;
    let infiniteEl;

    if (self.props.ptr && (self.props.ptrPreloader)) {
      ptrEl = (
        <div className="ptr-preloader">
          <div className="preloader" />
          <div className="ptr-arrow" />
        </div>
      );
    }
    if ((self.props.infinite) && self.props.infinitePreloader) {
      infiniteEl = (
        <div className="preloader infinite-scroll-preloader" />
      );
    }
    return (
      <div
        id={self.props.id}
        style={self.props.style}
        className={self.classes}
        data-ptr-distance={self.props.ptrDistance || undefined}
        data-infinite-distance={self.props.infiniteDistance || undefined}
        ref="el"
      >
        {ptrEl}
        {self.props.infiniteTop ? infiniteEl : self.slots.default}
        {self.props.infiniteTop ? self.slots.default : infiniteEl}
      </div>
    );
  },
  computed: {
    classes() {
      const self = this;
      return Utils.classNames(
        self.props.className,
        {
          tab: self.props.tab,
          'page-content': true,
          'tab-active': self.props.tabActive,
          'ptr-content': self.props.ptr,
          'infinite-scroll-content': self.props.infinite,
          'infinite-scroll-top': self.props.infiniteTop,
          'hide-bars-on-scroll': self.props.hideBarsOnScroll,
          'hide-navbar-on-scroll': self.props.hideNavbarOnScroll,
          'hide-toolbar-on-scroll': self.props.hideToolbarOnScroll,
          'messages-content': self.props.messagesContent,
          'login-screen-content': self.props.loginScreen,
        },
        Mixins.colorClasses(self),
      );
    },
  },
  componentDidMount() {
    const self = this;
    const el = self.refs.el;

    self.onPtrPullStart = self.onPtrPullStart.bind(self);
    self.onPtrPullMove = self.onPtrPullMove.bind(self);
    self.onPtrPullEnd = self.onPtrPullEnd.bind(self);
    self.onPtrRefresh = self.onPtrRefresh.bind(self);
    self.onPtrDone = self.onPtrDone.bind(self);
    self.onInfinite = self.onInfinite.bind(self);
    self.onTabShow = self.onTabShow.bind(self);
    self.onTabHide = self.onTabHide.bind(self);

    el.addEventListener('ptr:pullstart', self.onPtrPullStart);
    el.addEventListener('ptr:pullmove', self.onPtrPullMove);
    el.addEventListener('ptr:pullend', self.onPtrPullEnd);
    el.addEventListener('ptr:refresh', self.onPtrRefresh);
    el.addEventListener('ptr:done', self.onPtrDone);
    el.addEventListener('infinite', self.onInfinite);
    el.addEventListener('tab:show', self.onTabShow);
    el.addEventListener('tab:hide', self.onTabHide);
  },
  componentWillUnmount() {
    const self = this;
    const el = self.refs.el;

    el.removeEventListener('ptr:pullstart', self.onPtrPullStart);
    el.removeEventListener('ptr:pullmove', self.onPtrPullMove);
    el.removeEventListener('ptr:pullend', self.onPtrPullEnd);
    el.removeEventListener('ptr:refresh', self.onPtrRefresh);
    el.removeEventListener('ptr:done', self.onPtrDone);
    el.removeEventListener('infinite', self.onInfinite);
    el.removeEventListener('tab:show', self.onTabShow);
    el.removeEventListener('tab:hide', self.onTabHide);
  },
  methods: {
    onPtrPullStart(event) {
      this.dispatchEvent('ptr:pullstart ptrPullStart', event);
    },
    onPtrPullMove(event) {
      this.dispatchEvent('ptr:pullmove ptrPullMove', event);
    },
    onPtrPullEnd(event) {
      this.dispatchEvent('ptr:pullend ptrPullEnd', event);
    },
    onPtrRefresh(event) {
      this.dispatchEvent('ptr:refresh ptrRefresh', event, event.detail);
    },
    onPtrDone(event) {
      this.dispatchEvent('ptr:done ptrDone', event);
    },
    onInfinite(event) {
      this.dispatchEvent('infinite', event);
    },
    onTabShow(e) {
      this.dispatchEvent('tab:show tabShow', e);
    },
    onTabHide(e) {
      this.dispatchEvent('tab:hide tabHide', e);
    },
  },
};
