function Compile (el) {
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if(this.$el) {
    this.$fragment = this.node2Fragment(this.$el)
  }
}