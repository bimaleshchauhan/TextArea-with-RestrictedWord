import React, { useEffect, useRef, useState } from "react";
import contenteditableMaxLength from './maxLength'

const restricted_word = "illegal,unnecessary,non xx,Ram";
const allowedKeyCodes = [37, 38, 39, 40, 17]
const allowedKeyCodesWithCtrlKey = [65, 90, 86, 67, 88]
var voidNodeTags = ["AREA", "BASE", "MARK", "SPAN", "BR", "COL", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "MENUITEM", "META", "PARAM", "SOURCE", "TRACK", "WBR", "BASEFONT", "BGSOUND", "FRAME", "ISINDEX"];
const maxLength =30;

const EditableTag = () => {
const [remainingCharacters, setRemainingCharacters] =useState(30)  

useEffect(()=>{
  contenteditableMaxLength({
    element: document.getElementById('textarea'),
    maxLength: maxLength
  })
},[])

  //From: https://stackoverflow.com/questions/237104/array-containsobj-in-javascript
  Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  };

  function canContainText(node) {
    if (node.nodeType == 1) {
      return !voidNodeTags.contains(node.nodeName);
    } else {
      return false;
    }
  }

  function getLastChildElement(el) {
    var lc = el.lastChild;
    while (lc && lc.nodeType != 1) {
      if (lc.previousSibling) lc = lc.previousSibling;
      else break;
    }
    return lc;
  }

  function setEndOfContenteditable(contentEditableElement) {
    while (getLastChildElement(contentEditableElement) && canContainText(getLastChildElement(contentEditableElement))) {
      contentEditableElement = getLastChildElement(contentEditableElement);
    }

    var range, selection;
    if (document.createRange) {
      range = document.createRange();
      range.selectNodeContents(contentEditableElement); 
      range.collapse(false); 
      selection = window.getSelection(); 
      selection.removeAllRanges(); 
      selection.addRange(range); 
    } else if (document.selection) {
      //IE 8 and lower
      range = document.body.createTextRange(); 
      range.moveToElementText(contentEditableElement); 
      range.collapse(false); 
      range.select(); 
    }
  }

  //  function moveCursorToEnd(el){
  //    console.log("dfsdfsf", el)
  //     if(el.innerText && document.createRange)
  //     {
  //       window.setTimeout(() =>
  //         {
  //           let selection = document.getSelection();
  //           let range = document.createRange();

  //           range.setStart(el.childNodes[0],el.innerText.length);
  //           range.collapse(true);
  //           selection.removeAllRanges();
  //           selection.addRange(range);
  //         }
  //       ,1);
  //     }
  //   }

  function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  function getCaretPosition() {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML) rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }

  function applyHighlights(el) {
    let bad_word = "";
    el.innerHTML = el.innerHTML.replaceAll("<mark>", "").replaceAll("</mark>", "");
    if (restricted_word) {
      bad_word = restricted_word.toLowerCase().split(",").join("|");
    }
    const regix = new RegExp("\\b(" + bad_word + ")\\b", "gi");
    if (el.innerText.toLowerCase().match(regix)) {
      el.innerHTML = el.innerHTML.replaceAll(regix, "<mark>$&</mark>");
    }
  }

  

  function showCaretPos(event) {
    var el = document.getElementById("textarea");
    const isAllowedKey = allowedKeyCodes.includes(event.keyCode)
    const isShortcut = event.ctrlKey && allowedKeyCodesWithCtrlKey.includes(event.keyCode)
    const isAllowedAction = isAllowedKey || isShortcut 

    if (isAllowedAction) {
      return
    }
    applyHighlights(el);
    setEndOfContenteditable(el);
    const sss = getCaretCharacterOffsetWithin(el);
    if(el.innerText){
      setRemainingCharacters(maxLength - el.innerText.length)
    }
   
    // var caretPosEl = document.getElementById("caretPos");
   // caretPosEl.innerHTML = "Caret position: " + getCaretPosition(); //getCaretCharacterOffsetWithin(el);
  }

  //element.addEventListener('keyup', showCaretPos)
  document.body.onkeyup = showCaretPos;
  //document.body.onmouseup = showCaretPos;

  return (
    <div>
      <div contenteditable="true" id="textarea" spellchel="true">
      </div>
       <div>{remainingCharacters} remaining character</div>
      {/* <div id="caretPos"></div> */}
    </div>
  );
};

export default EditableTag;
