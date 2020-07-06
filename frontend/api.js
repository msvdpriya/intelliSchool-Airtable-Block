const serverURL = "https://d1fzd9muw39rgw.cloudfront.net";
const fetch = require("node-fetch");

export async function getQuiz(artifact) {
  const data = { text: artifact };
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  var param;
  if (!artifact) {
    return;
  } else if (typeof artifact === "object" && "filename" in artifact[0]) {
    param = {
      attachment: {
        type: artifact[0].type,
        url: artifact[0].url,
      },
      url: "",
      text: "",
    };
  } else if (artifact.match(regex)) {
    artifact = artifact.replace(
      "https://www.youtube.com/embed/",
      "https://www.youtube.com/watch?v="
    );
    console.log(artifact);
    param = {
      url: artifact,
      attachment: "",
      text: "",
    };
  } else {
    param = {
      text: artifact,
      url: "",
      attachment: "",
    };
  }

  const result = await fetch(serverURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return result.json();
}
