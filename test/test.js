'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var sandbox;

//// SUT
var walker = require('../src/walker');

// Mock tree structure
//           0
//         /   \
//        1     2
//       / \   /|\
//      3   4 5 6 7
//         / \
//        8   9
var tree = [{
  // 0
  firstChild: 1
}, {
  // 1
  firstChild: 3,
  nextSibling: 2
}, {
  // 2
  firstChild: 5
}, {
  // 3
  nextSibling: 4
}, {
  // 4
  firstChild: 8
}, {
  // 5
  nextSibling: 6
}, {
  // 6
  nextSibling: 7
}, {
  // 7
}, {
  // 8
  nextSibling: 9
}, {
  // 9
}];

describe('walker', function() {

  var callbackSpy;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    callbackSpy = sandbox.spy();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should call the callback once for every node in the tree', function() {
    var mockAdaptor = {
      child: function(node, cb) {
        cb();
        return tree[node.firstChild];
      },
      sibling: function(node) {
        return tree[node.nextSibling];
      }
    };
    walker(mockAdaptor, tree[0], callbackSpy);

    expect(callbackSpy).to.have.callCount(tree.length);
    tree.forEach(function(node) {
      expect(callbackSpy).to.have.been.calledWith(node);
    });

  });

  it('should call the callback with the params passed by the adaptor', function() {
    var mockAdaptor = {
      child: function(node, cb) {
        cb(1, 'hello', {test:[1,2,3]});
        return tree[node.firstChild];
      },
      sibling: function(node) {
        return tree[node.nextSibling];
      }
    };
    walker(mockAdaptor, tree[0], callbackSpy);

    tree.forEach(function(node) {
      expect(callbackSpy).to.have.been.calledWith(node, 1, 'hello', {test:[1,2,3]});
    });

  });

});