var Enum = require('enum');
var parse = require("./parse.js");

var States = new Enum(['Start', 'Whitespace', 'Value', 'Operation', 'Done']);

var tree = function(){
  this.type = ""; // label for S-expression
  this.children = [];
  this.value = null;
};

var print_tree = function(t, str){
  str += "(" + t.type + " ";
  if(t.children[0] != null){
    for(idx in t.children){
      str += print_tree(t.children[idx], "") + " ";
    }
  } else {
    str += t.value.toString();
  }
  str += ")";
  return str;
};

var print = function(t){
  console.log(print_tree(t, ""),"=", t.value);
  console.log("");
};

var actions = [
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
      t.value = "//";
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
];


var r = new parse.parser();

r.register_all(actions);
r.start = States.Start;
r.end = States.Done;

r.process("0.5 1 2 ! * 2 1 ^ + 10 + *");
print(r.stack.pop());

r.process("1 2 3 4 ! + - / 100 *");
print(r.stack.pop());

r.process("100 807 3 331 * + 2 2 1 + 2 + * 5 ^ * 23 10 558 * 10 * + + *");
print(r.stack.pop());
