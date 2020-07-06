import { loadCSSFromString } from "@airtable/blocks/ui";

/**
 * A string that contains all of the CSS used in this block.
 */
const cssString = `
.container {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 23px;
    color: #282c34;
    text-align: center;
  }
  
  h1, h2 {
    margin: 10px;
  }
  
  .answer {
    border: 1px solid #fff;
    padding: 5px 10px 5px 45px;
    width: 610px;
    text-align: left;
    margin-top: 10px;
    position: relative;
    font-size: 22px;
    cursor: pointer;
    transition: ease-in-out, width .35s ease-in-out;
  }
  
  .answer.selected {
    color : #4f4c4c;
    background-color: #c8ffbb;
  }
  
  .answer:hover {
    color: #4f4c4c;
    background-color: #c8ffbb;
  }
  
  .answer:focus {
    outline: none;
  }
  
  .results span.correct {
    color: #c8ffbb;
  }
  
  .results span.failed {
    color: #f27c7c;
  }
  
  .error {
    color: #f27c7c;
  }
  
  .letter {
    color: #4f4c4c;
    width: 30px;
    position: absolute;
    left: 0;
    text-align: center;
    height: 28px;
    top: 0;
    padding: 5px;
    text-transform: uppercase;
  }
  
  .results {
    color: #282c34;
  }
`;

/**
 * A function that loads the CSS on the page.
 */
function loadCSS() {
  loadCSSFromString(cssString);
}

export default loadCSS;
