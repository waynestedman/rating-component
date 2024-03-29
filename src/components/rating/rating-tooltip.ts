/* this is a sub-component the uses the @floating-ui/dom library to generate an enhancable tooltip. Borrowed from a Lit example. */

import {html, css, LitElement} from 'lit';
import {customElement, property } from 'lit/decorators.js';

// Positioning library
import {computePosition, autoPlacement, offset, shift} from '@floating-ui/dom';
// Events to turn on/off the tooltip
const enterEvents = ['pointerenter', 'focus'];
const leaveEvents = ['pointerleave', 'blur', 'keydown', 'click'];

@customElement('rating-tooltip')
export class RatingTooltip extends LitElement {

  static styles = css`
    :host {
      display: inline-block;
      position: fixed;
      padding: 13px;
      border: 1px solid darkgray;
      border-radius: var(--rating-popup-box);
      background: var(--rating-popup);
      color: #fff;
      pointer-events: none;
      font-size: 12px;
      font-weight: 500;
    }
  `;

  // Position offset
  @property({type: Number})
  offset = 4;

  _target: Element|null = null;

  get target() {
    return this._target;
  }
  set target(target: Element|null) {
    // Remove events from existing target
    if (this.target) {
      enterEvents.forEach(name =>
        this.target!.removeEventListener(name, this.show));
      leaveEvents.forEach(name =>
        this.target!.removeEventListener(name, this.hide));
    }
    // Add events to new target
    if (target) {
      enterEvents.forEach(name =>
        target!.addEventListener(name, this.show));
      leaveEvents.forEach(name =>
        target!.addEventListener(name, this.hide));
    }
    this._target = target;
  }

  connectedCallback() {
    super.connectedCallback();
    this.hide();
    this.target ??= this.previousElementSibling;
  }

  render() {
    return html`<slot></slot>`;
  }

  show = () => {
    this.style.cssText = '';
    // Robust positioning
    computePosition(this.target, this, {
      strategy: 'fixed',
      middleware: [
        offset(this.offset),
        shift(),
        autoPlacement({allowedPlacements: ['top']})
      ],
    }).then(({x, y}: {x: number, y: number}) => {
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    });
  };

  hide = () => {
    this.style.display = 'none';
  };

}
