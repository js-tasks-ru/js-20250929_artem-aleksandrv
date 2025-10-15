export default class NotificationMessage {
  static lastShownComponent;
  constructor(message, options = {}) {
    this.message = message;
    const {duration = 1000, type = 'success'} = options;
    this.duration = duration;
    this.type = type;
    this.timerId = null;
    this.element = this.createElement();
  }

  createTemplate() {
    return `
      <div class="timer"></div>
      <div class="inner-wrapper">
       <div class="notification-header">${this.type}</div>
       <div class="notification-body">
         ${this.message}
       </div>
     </div>
    `;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('notification', `${this.type}`);
    element.innerHTML = this.createTemplate();
    return element;
  }

  show(element) {
    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.hide();
    }
    NotificationMessage.lastShownComponent = this;
    this.element = this.createElement();
    if (element) {
      element.appendChild(this.element);
    } else {
      document.body.append(this.element);
    }
    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (NotificationMessage.lastShownComponent === this) {
      NotificationMessage.lastShownComponent = null;
    }
  }

  hide() {
    this.remove();
  }

  destroy() {
    this.remove();
  }
}
