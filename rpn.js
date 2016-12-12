var Enum = require('enum');
var tree = require('./trees.js').tree;
var States = new Enum(['Start', 'Whitespace', 'Value', 'Operation', 'Done']);

module.exports = {
  start: States.Start,
  end: States.Done,
  
  actions: [
    {
      re: "$",
      op: function(a, stack){
        return States.Done;
      },
      states: [States.Start, States.Whitespace, States.Value, States.Operation]
    },
    {
      re: "[^\\S\\n]+",
      op: function(a, stack){
        return States.Whitespace;
      },
      states: [States.Start, States.Value, States.Operation]
    },
    {
      re: "[0-9]+",
      op: function(a, stack){
        var t = new tree();
        t.type = "Int";
        t.value = parseInt(a);
        stack.push(t);
        return States.Value;
      },
      states: [States.Start, States.Whitespace]
    },
    {
      re: "[0-9]+\\.[0-9]*",
      op: function(a, stack){
        var t = new tree();
        t.type = "Float";
        t.value = parseFloat(a);
        stack.push(t);
        return States.Value;
      },
      states: [States.Start, States.Whitespace]
    },
    {
      re: "\\+",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "+";
        t.children.push(x);
        t.children.push(y);
        t.value = x.value + y.value;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "-",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "-";
        t.children.push(x);
        t.children.push(y);
        t.value = x.value - y.value;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "\\*",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "*";
        t.children.push(x);
        t.children.push(y);
        t.value = x.value * y.value;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "/",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "/";
        t.children.push(x);
        t.children.push(y);
        t.value = x.value / y.value;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "//",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "//";
        t.children.push(x);
        t.children.push(y);
        t.value = Math.floor(x.value / y.value);
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "%",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "%";
        t.children.push(x);
        t.children.push(y);
        t.value = x.value % y.value;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "\\^",
      op: function(a, stack){
        var y = stack.pop();
        var x = stack.pop();
        var t = new tree();
        t.type = "^";
        t.children.push(x);
        t.children.push(y);
        t.value = Math.pow(x.value, y.value);
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    },
    {
      re: "!",
      op: function(a, stack){
        var end = stack.pop();
        var n = 1;
        for(i = 2; i <= end.value; i++){
          n = n * i;
        }
        var t = new tree();
        t.type = "!";
        t.children.push(end);
        t.value = n;
        stack.push(t);
        return States.Operation;
      },
      states: [States.Whitespace]
    }
  ]
};
