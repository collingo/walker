module.exports = function(adaptor, rootnode, callback) {

  function walker(node) {
    debugger;
    callback(node);
    node = adaptor.child(node);
    while (node) {
      walker(node, callback);
      node = adaptor.sibling(node);
    }
  }

  walker(rootnode);

};