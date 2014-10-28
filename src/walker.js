module.exports = function(adaptor, rootnode, callback, params) {

  function walker(node) {
    var args = Array.prototype.slice.call(arguments, 0);
    callback.apply(this, args);
    adaptor.child.bind(this, walker).apply(this, args);
    adaptor.sibling.bind(this, walker).apply(this, args);
  }

  walker.bind(this, rootnode).apply(this, params || []);

};