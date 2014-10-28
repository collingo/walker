module.exports = function(adaptor, rootnode, callback) {

  function walker(node) {
    var args = Array.prototype.slice.call(arguments, 0);
    callback.apply(this, args);
    adaptor.child.bind(adaptor, walker).apply(adaptor, args);
    adaptor.sibling.bind(adaptor, walker).apply(adaptor, args);
  }

  walker.bind(this, rootnode).apply(this, adaptor.initialParams || []);

};