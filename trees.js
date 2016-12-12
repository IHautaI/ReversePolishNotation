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

module.exports = {
  tree: function(){
    this.type = ""; // label for S-expression
    this.children = [];
    this.value = null;
  },

  print: function(t){
    console.log(print_tree(t, ""), " = ", t.value);
    console.log("");
  }
};
