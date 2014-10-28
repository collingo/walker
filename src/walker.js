module.exports = function(adaptor, rootnode, callback) {

  function walker(node) {
    node = adaptor.child(node, callback.bind(rootnode, node));
    while (node) {
      walker(node);
      node = adaptor.sibling(node);
    }
  }

  walker(rootnode);

};