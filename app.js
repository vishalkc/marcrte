import * as CodeMirror from './lib/codemirror';
import './lib/show-hint';
import './lib/simple';
import './lib/polyfills'
import './lib/codemirror.css';
import './lib/show-hint.css';
import './lib/docs.css';

var sc = document.getElementById("modecode");
var code = document.getElementById("code");
var editor = CodeMirror(code, {
value: "",//(sc.textContent || sc.innerText || sc.innerHTML),
mode: "simplemode"
//extraKeys: {"Ctrl-D": "autocomplete"}
});

var code1 = document.getElementById("code1");
var editor1 = CodeMirror(code, {
value: "",//(sc.textContent || sc.innerText || sc.innerHTML),
mode: "simplemode"
//extraKeys: {"Ctrl-D": "autocomplete"}
});


CodeMirror.hint.javascript = function(cm) {
var inner = {from: cm.getCursor(), to: cm.getCursor(), list: []};
inner.list.push({text:"a", displayText:"a - test"});  
inner.list.push({text:"b", displayText:"b - test"});
inner.list.push({text:"1", displayText:"1 - test"});
return inner;
};

CodeMirror.hint.javascript1 = function(cm) {
var inner = {from: cm.getCursor(), to: cm.getCursor(), list: []};
inner.list.push({text:"b", displayText:"b - test"});
inner.list.push({text:"a", displayText:"a - test"});
inner.list.push({text:"c", displayText:"c - test"});
return inner;
};

editor.setOption("extraKeys", {
Tab: function(cm) {  
var currentCursor = cm.getCursor();
var val = editor.getValue();
var ch = val.indexOf("ǂ", currentCursor.ch);
cm.setCursor({line: currentCursor.line, ch: ch+3})
//cm.replaceSelection("tab");
},
"Ctrl-D": function(cm) {    
cm.replaceSelection("ǂ");
cm.showHint({hint: CodeMirror.hint.javascript});
},  
"Alt-C": function(cm) {    
cm.replaceSelection("©");
}
});


editor1.setOption("extraKeys", {
Tab: function(cm) {    
cm.replaceSelection("tab");
},
"Ctrl-D": function(cm) {    
cm.replaceSelection("ǂ");
cm.showHint({hint: CodeMirror.hint.javascript1});
},  
"Alt-C": function(cm) {    
cm.replaceSelection("©");
}
});

editor.setValue('ǂa Authority data ǂb test data ǂc sub field data');

editor.on("beforeChange", function(cm, changeObj) {
var typedNewLine = changeObj.origin == '+input' && typeof changeObj.text == "object" && changeObj.text.join("") == "";
if (typedNewLine) {
  return changeObj.cancel();
}

var pastedNewLine = changeObj.origin == 'paste' && typeof changeObj.text == "object" && changeObj.text.length > 1;
if (pastedNewLine) {
  var newText = changeObj.text.join(" ");

  // trim
  //newText = $.trim(newText);

  return changeObj.update(null, null, [newText]);
}

return null;
});

hyperlinkOverlay(editor);
hyperlinkOverlay(editor1);
function hyperlinkOverlay(cm) {
if (!cm) return;

const rx_word = "ǂ"; // Define what separates a word
function isUrl(code, data) {
  if(code == "a" && data.trim() == "Authority data"){
      return true;
  }
  else{
      return false;
  }
}
cm.addOverlay({
  token: function(stream) {
      let ch = stream.peek();
      let word = "";
      let code = "";
      let startPosition = 0;
      
      if (rx_word.includes(ch) || ch==='\uE000' || ch==='\uE001') {
          stream.next();
          return null;
      }
      while ((ch = stream.peek()) && !rx_word.includes(ch)) {
          if(ch!=" " && code ===""){				
              code = ch;
              startPosition = startPosition + 1;
          }
          else {
              if(code != "" && !(word ==="" && ch==" ")){	
                  word += ch;
              }
              else{				
                  startPosition = startPosition + 1;
              }
          }
          stream.next();
      }
      
      if(word.trim() == ""){
          return null;
      }
      
      let leadingSpaceCount = word.length - word.trim().length;
      stream.start = stream.start + startPosition;
      if(word.substring(word.length - 1) == " "){			
          stream.pos = stream.pos - leadingSpaceCount;
      }
      if (isUrl(code, word)) return "url"; // CSS class: cm-url
  }}, 
  { opaque : true }  // opaque will remove any spelling overlay etc
);
hoverWidgetOnOverlay(cm, 'url');
}

function hoverWidgetOnOverlay(cm, overlayClass) {
cm.getWrapperElement().addEventListener('click', e => {

let onToken=e.target.classList.contains("cm-"+overlayClass);
if(onToken){    
let code = e.target.previousElementSibling.innerText.length>1? e.target.previousElementSibling.innerText[1]:"";
let data = e.target.innerText? e.target.innerText.trim():"";
alert("Authority View");//code="+code + "&Data="+ data);
}
});
}