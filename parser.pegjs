program = statements:(_ statement:statement _ {return statement;})+ _ {return statements;}

statement 
  = _ statement:decVariable _ ";" _ { return statement }
  /_ statement:assign _ ";" _ { return statement }
  /_ statement:ifElse _ { return statement }
  /_ statement:whileLoop _ { return statement }

decVariable = type:identifier _ name:identifier _ "=" _ expression:expression { return new DecVariable(type, name, expression); }
assign = _ name:identifier _ "=" _ expression:expression { return new Assign(name, expression); }

ifElse
  = _ "if" _ "(" _ condition:expression _ ")" _ "{" _ thenBlock:statement+ _ "}" _ "else" _ "{" _ elseBlock:statement+ _ "}" _  { return new IfElse(condition, thenBlock, elseBlock); }

whileLoop
  = _ "while" _ "(" _ condition:expression _ ")" _ "{" _ block:statement+ _ "}" _ { return new WhileLoop(condition, block); }

expression = _ condition:condition _ { return condition }

condition = _ left:additive  _ op:("<" / ">" / "==" / "!=") _ right:condition {
      return new Arith(op, left, right);
        
    }
    / additive

additive
  = _ left:multiplicative  _ op:("+" / "-") _ right:additive {
      return new Arith(op, left, right);
        
    }
    / multiplicative 

multiplicative
  = _ left:primary  _ op:("*" / "/") _ right:multiplicative {
        return new Arith(op, left, right);
        
    }
  / primary

primary
  = _ integer
  / _ identifier:identifier { return new Variable(identifier);}
  / _ "(" _ expression:expression _ ")"

integer = _ digits:[0-9]+ { return new Integer(digits.join("")); }

identifier = _ name:[a-z]+ { return name.join(""); }

// 空白を意味するルール
_ "whitespace" = [ \t\n]*