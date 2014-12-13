module.exports = function(adaptor, rootnode, callback) {

  function walker() {
    var ignoreChildren = callback.apply(this, arguments);
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(walker);
    if(!ignoreChildren) {
      adaptor.child.apply(adaptor, args);
    }
    adaptor.sibling.apply(adaptor, args);
  }

  walker.apply(this, ([rootnode].concat(adaptor.initialParams || [])));

};