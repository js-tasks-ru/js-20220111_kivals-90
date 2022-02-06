class Tooltip {
  static instance;

  constructor() {
    const instance = Tooltip.instance;
    if (instance) {
      return instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    document.addEventListener('pointerover', this.pointeroverHandler.bind(this));
    document.addEventListener('pointerout', this.pointeroutHandler.bind(this));
  }

  pointeroverHandler(event) {
    let tooltipElement = event.target.closest('[data-tooltip]');
    if (tooltipElement) {
      const tooltipText = tooltipElement.dataset.tooltip;
      this.render(event, tooltipText);
      document.addEventListener('pointermove', this.pointerMoveHandler.bind(this));
    }
  }

  pointerMoveHandler(event) {
    const shift = 25;
    this.element.style.left = event.clientX + shift + 'px';
    this.element.style.top = event.clientY + shift + 'px';
  }

  pointeroutHandler() {
    this.remove();
    document.removeEventListener('pointermove', this.pointerMoveHandler);
  }

  render(event, text) {
    let tooltipElem = document.createElement('div');
    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = text;
    this.element = tooltipElem;
    document.body.append(this.element);

  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.pointeroverHandler);
    document.removeEventListener('pointermove', this.pointerMoveHandler);
    document.removeEventListener('pointerout', this.pointeroutHandler);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
