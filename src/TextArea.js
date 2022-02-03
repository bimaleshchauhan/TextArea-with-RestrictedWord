import React, { useRef } from "react";
const restricted_word = "illegal, unnecessary, non xx, Ram"
const TextArea = () => {
  const $textarea = useRef(null);
  var $backdrop = useRef(null);
  var $highlights = useRef(null);

  function applyHighlights(text) {
      let bad_word = ""
      if(restricted_word){
         bad_word = restricted_word.toLowerCase().split(",").join('|');
      }
     const regix = new RegExp('\\b(' + bad_word + ')\\b', "gi")
    text = text
      .replace(/\n$/g, "\n\n")
      .replace(regix, "<mark>$&</mark>");
    return text;
  }

  const handleChange = () => {
    var text = $textarea.current.value;
    var highlightedText = applyHighlights(text);
    $highlights.current.innerHTML = highlightedText;
    console.log("data", $textarea.current.value);
  };

  const handleScroll = () => {
    var scrollTop = $textarea.current.scrollTop;
    $backdrop.current.scrollTop = scrollTop;
    var scrollLeft = $textarea.current.scrollLeft;
    $backdrop.current.scrollLeft = scrollLeft;
  };
  return (
    <div>
      <div className="container">
        <div className="backdrop" ref={$backdrop}>
          <div className="highlights" ref={$highlights}></div>
        </div>
        <textarea
          spellCheck="false"
          ref={$textarea}
          onChange={handleChange}
          onScroll={handleScroll}
        ></textarea>
      </div>
    </div>
  );
};
export default TextArea;
