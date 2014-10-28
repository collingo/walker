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
//              0:A
//          /         \
//        1:B         2:C
//       /   \      /  |  \
//     3:D   4:E  5:F 6:G 7:H
//          /   \
//        8:I   9:J

var tree = [{
  // 0
  value: 'A',
  firstChild: 1
}, {
  // 1
  value: 'B',
  firstChild: 3,
  nextSibling: 2
}, {
  // 2
  value: 'C',
  firstChild: 5
}, {
  // 3
  value: 'D',
  nextSibling: 4
}, {
  // 4
  value: 'E',
  firstChild: 8
}, {
  // 5
  value: 'F',
  nextSibling: 6
}, {
  // 6
  value: 'G',
  nextSibling: 7
}, {
  // 7
  value: 'H'
}, {
  // 8
  value: 'I',
  nextSibling: 9
}, {
  // 9
  value: 'J'
}];
var walkOrder = [
  tree[0],
  tree[1],
  tree[3],
  tree[4],
  tree[8],
  tree[9],
  tree[2],
  tree[5],
  tree[6],
  tree[7]
];
var pathOrder = [
  [],
  ['B'],
  ['B','D'],
  ['B','E'],
  ['B','E','I'],
  ['B','E','J'],
  ['C'],
  ['C','F'],
  ['C','G'],
  ['C','H']
];


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
      child: function(cb, node) {
        var next = tree[node.firstChild];
        if(next) {
          cb(next);
        }
      },
      sibling: function(cb, node) {
        var next = tree[node.nextSibling];
        if(next) {
          cb(next);
        }
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
      child: function(cb, node, path) {
        var next = tree[node.firstChild];
        path = [].concat(path);
        if(next) {
          path.push(next.value);
          cb(next, path);
        }
      },
      sibling: function(cb, node, path) {
        var next = tree[node.nextSibling];
        path = [].concat(path);
        path.pop();
        if(next) {
          path.push(next.value);
          cb(next, path);
        }
      }
    };
    walker(mockAdaptor, tree[0], callbackSpy, [[]]);

    walkOrder.forEach(function(path, index) {
      expect(callbackSpy).to.have.been.calledWith(walkOrder[index], pathOrder[index]);
    });

  });

  it('should call the adaptor methods with the params passed by the previous adaptor', function() {
    var mockAdaptor = {
      child: sandbox.spy(function(cb, node, path) {
        var next = tree[node.firstChild];
        path = [].concat(path);
        if(next) {
          path.push(next.value);
          cb(next, path);
        }
      }),
      sibling: sandbox.spy(function(cb, node, path) {
        var next = tree[node.nextSibling];
        path = [].concat(path);
        path.pop();
        if(next) {
          path.push(next.value);
          cb(next, path);
        }
      })
    };
    walker(mockAdaptor, tree[0], callbackSpy, [[]]);

    walkOrder.forEach(function(path, index) {
      expect(mockAdaptor.child.getCall(index).args[1]).to.equal(walkOrder[index]);
      expect(mockAdaptor.child.getCall(index).args[2]).to.deep.equal(pathOrder[index]);
    });

  });

});