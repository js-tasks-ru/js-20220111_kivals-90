export default class NotificationMessage {
  static activeInstance = null;

  timerId = 0;

  constructor(message = '', { duration = 2000, type = 'success' } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getTemplate() {
    return `
      <div class="notification ${this.type.toLowerCase()}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">Notification</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
  }

  show(target = document.body) {
    if (NotificationMessage.activeInstance) {
      NotificationMessage.activeInstance.remove();
    }

    NotificationMessage.activeInstance = this;

    target.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove () {
    clearTimeout(this.timerId);
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
