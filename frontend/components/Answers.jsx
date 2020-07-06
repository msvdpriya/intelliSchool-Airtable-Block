import React from "react";
import Answer from "./Answer";

function Answers(props) {
  return (
    <>
      <Answer
        letter="a"
        answer={props.answers[0]}
        handelClick={props.handelClick}
        selected={props.currentAnswer === "a"}
      />
      <Answer
        letter="b"
        answer={props.answers[1]}
        handelClick={props.handelClick}
        selected={props.currentAnswer === "b"}
      />
      <Answer
        letter="c"
        answer={props.answers[2]}
        handelClick={props.handelClick}
        selected={props.currentAnswer === "c"}
      />
      <Answer
        letter="d"
        answer={props.answers[3]}
        handelClick={props.handelClick}
        selected={props.currentAnswer === "d"}
      />
    </>
  );
}

export default Answers;
