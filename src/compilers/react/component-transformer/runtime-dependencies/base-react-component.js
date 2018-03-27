import React from 'react';

export default class __BaseReactComponent extends React.Component {
  get slots() {
    const self = this;
    const slots = {};

    if (!self.props.children || self.props.children.length == 0) {
      return slots;
    }

    let slotChildren;

    if (Array.isArray(self.props.children)) {
      self.props.children.forEach((child) => {
        const slotName = child.props && child.props.slot || 'default';
        if (!slots[slotName]) slots[slotName] = [];
        slots[slotName].push(child);
      });
    } else if (self.props.children.props && self.props.children.props.slot) {
      const slotName = self.props.children.props.slot;
      if (!slots[slotName]) slots[slotName] = [];
      slots[slotName].push(self.props.children);
    } else if (self.props.children.props && !self.props.children.props.slot) {
      if (!slots.default) slots.default = [];
      slots.default.push(self.props.children);
    }

    return slots;
  }

  get children() {
    const self = this;
    const children = [];
    let child = self._reactInternalFiber && self._reactInternalFiber.child;
    function findChildren(node) {
      if (node.type && typeof node.type === 'function') {
        children.push(node.stateNode);
      } else if (node.child) {
        findChildren(node.child);
      }
      if (node.sibling) findChildren(node.sibling);
    }
    if (child) findChildren(child);
    return children;
  }

  get parent() {
    const self = this;
    const el = self.el;
    let parent;
    let reactProp;
    function checkParentNode(node) {
      if (!node) return;
      if (!reactProp) {
        for (let propName in node) {
          if (propName.indexOf('__reactInternalInstance') >= 0) reactProp = propName;
        }
      }
      if (
        node[reactProp] &&
        node[reactProp]._debugOwner &&
        typeof node[reactProp]._debugOwner.type === 'function' &&
        node[reactProp]._debugOwner.stateNode &&
        node[reactProp]._debugOwner.stateNode !== self
      ) {
        parent = node[reactProp]._debugOwner.stateNode;
        return;
      }

      checkParentNode(node.parentNode);
    }

    if (self._reactInternalFiber._debugOwner) {
      return self._reactInternalFiber._debugOwner.stateNode;
    } else if (el) {
      checkParentNode(el);
    }

    return parent;
  }
  
  get el() {
    const self = this;
    let el;
    let child = self._reactInternalFiber.child;

    while (!el && child) {
      if (child.stateNode && child.stateNode instanceof window.HTMLElement) {
        el = child.stateNode;
      } else {
        child = child.child;
      }
    }

    return el;
  }

  dispatchEvent(events, ...args) {
    const self = this;

    if (!events || !events.trim().length) return;

    events.trim().split(' ').forEach((event) => {
      const eventName = (event || '')
        .trim()
        .split(/[ -_:]/)
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join('');

      const propName = `on${eventName}`;

      if (self.props[propName]) self.props[propName](...args);
    });
  }
}
