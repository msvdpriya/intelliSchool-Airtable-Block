import React, { useEffect, useState, Fragment } from "react";
import {
  initializeBlock,
  useBase,
  useRecords,
  Button,
  Box,
  Dialog,
  Heading,
  Text,
  Loader,
  FormField,
  TablePickerSynced,
  FieldPickerSynced,
  useGlobalConfig,
  expandRecordPickerAsync,
  expandRecord,
} from "@airtable/blocks/ui";
import { getQuiz } from "./api";
import Progress from "./components/Progress";
import Question from "./components/Question";
import Answers from "./components/Answers";
import loadCSS from "./loadCSS";
import { FieldType } from "@airtable/blocks/models";

loadCSS();

const Screens = Object.freeze({
  CONFIGURING_SETTINGS: "configuringSettings",
  HOME_SCREEN: "homeScreen",
  QUIZ: "playing",
});

function QuizGenerationBlock() {
  const [visibleScreen, setVisibleScreen] = useState(
    Screens.CONFIGURING_SETTINGS
  );
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const base = useBase();

  const globalConfig = useGlobalConfig();
  const sourceTableId = globalConfig.get("selectedSourceTableId");
  const quizTableId = globalConfig.get("selectedQuizTableId");
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [selectedFieldType, setSelectedFieldType] = useState(null);
  const sourceTable = base.getTableByIdIfExists(sourceTableId);
  const quizTable = base.getTableByIdIfExists(quizTableId);
  let records = useRecords(sourceTable);
  const [loading, setLoading] = useState(true);
  let text = "";

  useEffect(() => {
    if (
      !globalConfig.get("selectedSourceTableId") ||
      !globalConfig.get("selectedQuizTableId") ||
      !selectedFieldId
    ) {
      setVisibleScreen(Screens.CONFIGURING_SETTINGS);
    }

    if (!selectedFieldId) {
      setSelectedFieldId(globalConfig.get("selectedFieldId"));
      setSelectedFieldType(
        sourceTable && globalConfig.get("selectedFieldId")
          ? sourceTable.getFieldByIdIfExists(
              globalConfig.get("selectedFieldId")
            ).type
          : null
      );
    }

    if (selectedRecordId) {
      text = records
        .find((record) => {
          return record.id == selectedRecordId;
        })
        .getCellValue(selectedFieldId);
    }

    getQuiz(text).then((result) => {
      if (result) {
        setQuestions(result.quiz);
        setNotes(result.notes);
        setSummary(result.summary);
        setLoading(false);
      }
    });
  }, [selectedRecordId]);

  switch (visibleScreen) {
    case Screens.CONFIGURING_SETTINGS:
      return (
        <SetupForm
          setVisibleScreen={setVisibleScreen}
          setSelectedRecordId={setSelectedRecordId}
          setSelectedFieldId={setSelectedFieldId}
          setSelectedFieldType={setSelectedFieldType}
          selectedFieldId={selectedFieldId}
        />
      );
    case Screens.HOME_SCREEN:
      return (
        <HomeForm
          setVisibleScreen={setVisibleScreen}
          summary={summary}
          notes={notes}
          setSelectedRecordId={setSelectedRecordId}
          selectedRecordId={selectedRecordId}
          setSelectedFieldId={setSelectedFieldId}
          selectedFieldId={selectedFieldId}
          setSelectedFieldType={setSelectedFieldType}
          selectedFieldType={selectedFieldType}
          records={records}
        />
      );
    case Screens.QUIZ:
      if (loading) {
        return (
          <div style={{ display: "flex" }}>
            <Text size="large" style={{ marginRight: "5px" }}>
              Generating Quiz..
            </Text>
            <Loader />
          </div>
        );
      } else {
        return (
          <Quiz
            setVisibleScreen={setVisibleScreen}
            questions={questions}
            loading={loading}
            setLoading={setLoading}
            setSelectedRecordId={setSelectedRecordId}
            setSelectedFieldId={setSelectedFieldId}
            setSelectedFieldType={setSelectedFieldType}
          />
        );
      }

    default:
      throw new Error("Unexpected screen: ", visibleScreen);
  }
}

function Quiz({ setVisibleScreen, questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const question = questions[currentQuestion];

  const handelClick = (e) => {
    setCurrentAnswer(e.target.value);
    setError("");
  };

  const renderError = () => {
    if (!error) {
      return;
    }
    return <div className="error">{error}</div>;
  };

  const renderResultMark = (question, answer) => {
    if (question.correct_answer === answer.answer) {
      return <span className="correct">Correct</span>;
    }
    return <span className="failed">Wrong</span>;
  };

  const renderResultsData = () => {
    return answers.map((answer) => {
      const question = questions.find(
        (question) => question.id === answer.questionId
      );
      return (
        <div key={question.id} marginBottom={3} textAlign="left">
          {question.id}. {question.question}{" "}
          {renderResultMark(question, answer)}
        </div>
      );
    });
  };
  const restart = () => {
    setAnswers([]);
    setCurrentAnswer("");
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const next = () => {
    const answer = { questionId: question.id, answer: currentAnswer };

    if (!currentAnswer) {
      setError("Please Select an option");
      return;
    }

    answers.push(answer);
    setAnswers(answers);
    setCurrentAnswer("");
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="container results">
        <h2>Results</h2>
        <div marginBottom="3" textAlign="left">
          {renderResultsData()}
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={restart}
          icon="redo"
          margin={2}
        >
          Restart
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={() => {
            setVisibleScreen(Screens.HOME_SCREEN);
          }}
          icon="home"
          margin={2}
        >
          Home
        </Button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <Progress total={questions.length} current={currentQuestion + 1} />
        <Question question={question.question} />
        {renderError()}
        <Answers
          answers={question.answers}
          handelClick={handelClick}
          currentAnswer={currentAnswer}
        />
        <Button
          variant="primary"
          size="large"
          onClick={next}
          margin={2}
          icon="chevronRight"
        >
          Next
        </Button>
        <Button
          variant="danger"
          size="large"
          onClick={() => {
            setVisibleScreen(Screens.HOME_SCREEN);
          }}
          margin={2}
          icon="x"
        >
          Quit
        </Button>
      </div>
    );
  }
}

function HomeForm({
  setVisibleScreen,
  summary,
  notes,
  setSelectedRecordId,
  selectedRecordId,
  selectedFieldId,
  selectedFieldType,
  records,
}) {
  const base = useBase();
  const globalConfig = useGlobalConfig();

  const sourceTableId = globalConfig.get("selectedSourceTableId");
  const quizTableId = globalConfig.get("selectedQuizTableId");
  const sourceTable = base.getTableByIdIfExists(sourceTableId);

  if (!selectedRecordId) {
    return (
      <Box
        position="absolute"
        borderRight="thick"
        justifyContent="center"
        width="100%"
        padding={3}
        top={0}
        left={0}
        bottom={0}
      >
        <Heading textAlign="center" marginBottom={2}>
          intelliSchool Home
        </Heading>

        <Box
          padding={4}
          borderRadius={5}
          border="thick"
          marginBottom={2}
          marginTop={5}
        >
          <Heading>
            To Start Learning Click on the "Choose Note" button to choose a
            record from your notes table.
          </Heading>
          <Box>
            <Button
              onClick={() => {
                expandRecordPickerAsync(records).then((recordA) => {
                  if (recordA !== null) {
                    const recordId = recordA.id;
                    setSelectedRecordId(recordId);
                  } else {
                    return null;
                  }
                });
              }}
              margin={2}
              size="large"
              variant="primary"
              icon="expand"
            >
              Choose Note
            </Button>
            <Button
              onClick={() => {
                const recordFields = {
                  Title: "",
                };
                if (sourceTable.hasPermissionToCreateRecord(recordFields)) {
                  sourceTable
                    .createRecordAsync(recordFields)
                    .then((recordId) => {
                      sourceTable.selectRecordsAsync().then((result) => {
                        expandRecord(result.getRecordById(recordId));
                      });
                    });
                }
              }}
              margin={2}
              size="large"
              variant="primary"
              icon="plus"
            >
              Add Note
            </Button>
            <Button
              onClick={() => setVisibleScreen(Screens.CONFIGURING_SETTINGS)}
              margin={2}
              size="large"
              icon="settings"
            >
              Settings
            </Button>
          </Box>
          <Box borderRadius={5} marginBottom={2} marginTop={2} textAlign="left">
            <Text>
              We generate quiz, key points and summary automatically from the
              text, video or file that you choose. Start Learning by clicking on
              "Choose Record" button above. Use Settings button to change
              configuration settings.
            </Text>
          </Box>
        </Box>
      </Box>
    );
  } else {
    let atrifactHTML = "";
    let artifactContent = records
      .find((x) => {
        return x.id == selectedRecordId;
      })
      .getCellValue(selectedFieldId);
    if (selectedFieldType == FieldType.MULTILINE_TEXT) {
      atrifactHTML = <Text variant="paragraph">{artifactContent}</Text>;
    } else if (selectedFieldType == FieldType.URL) {
      atrifactHTML = (
        <div style={{ position: "relative", paddingBottom: "56.25%" }}>
          <iframe
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: "0px",
              top: "0px",
            }}
            frameborder="0"
            width="100%"
            height="100%"
            src={artifactContent}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      );
    } else if (selectedFieldType == FieldType.MULTIPLE_ATTACHMENTS) {
      artifactContent = artifactContent[0].url;
    }
    return (
      <Box
        position="absolute"
        borderRight="thick"
        justifyContent="center"
        width="100%"
        padding={3}
        top={0}
        left={0}
        bottom={0}
      >
        <Heading textAlign="center" marginBottom={2}>
          intelliSchool Home
        </Heading>
        <Box padding={2}>{atrifactHTML}</Box>
        <Heading variant="caps" size="default" marginTop={2}>
          {records
            .find((x) => {
              return x.id == selectedRecordId;
            })
            .getCellValue("Title")}
        </Heading>
        <Text size="small" marginBottom={2}>
          Content generated automatically using selected field of type{" "}
          {selectedFieldType}
        </Text>
        <Heading variant="caps" size="small">
          Summary
        </Heading>
        <Box padding={2} borderRadius={5} border="thick" marginBottom={2}>
          <Text variant="paragraph">{summary}</Text>
        </Box>
        <Heading variant="caps" size="small">
          Key Points
        </Heading>
        <Box padding={2} borderRadius={5} border="thick" marginBottom={2}>
          <Text variant="paragraph">{notes}</Text>
        </Box>
        <Box>
          <Button
            onClick={() => setVisibleScreen(Screens.QUIZ)}
            margin={2}
            size="large"
            variant="primary"
            icon="play"
          >
            Start Quiz
          </Button>
          <Button
            onClick={() => {
              expandRecordPickerAsync(records).then((recordA) => {
                if (recordA !== null) {
                  const recordId = recordA.id;
                  setSelectedRecordId(recordId);
                } else {
                  return null;
                }
              });
            }}
            margin={2}
            size="large"
            variant="primary"
            icon="expand"
          >
            Choose Note
          </Button>
          <Button
            onClick={() => {
              const recordFields = {
                Title: "",
              };
              if (sourceTable.hasPermissionToCreateRecord(recordFields)) {
                sourceTable.createRecordAsync(recordFields).then((recordId) => {
                  sourceTable.selectRecordsAsync().then((result) => {
                    expandRecord(result.getRecordById(recordId));
                  });
                });
              }
            }}
            margin={2}
            size="large"
            variant="primary"
            icon="plus"
          >
            Add Note
          </Button>
          <Button
            onClick={() => setVisibleScreen(Screens.CONFIGURING_SETTINGS)}
            margin={2}
            size="large"
            icon="settings"
          >
            Settings
          </Button>
        </Box>
      </Box>
    );
  }
}

function SetupForm({
  setVisibleScreen,
  setSelectedFieldId,
  setSelectedFieldType,
}) {
  const base = useBase();
  const globalConfig = useGlobalConfig();

  const sourceTableId = globalConfig.get("selectedSourceTableId");
  const sourceTable = base.getTableByIdIfExists(sourceTableId);

  return (
    <Dialog
      onClose={() => setVisibleScreen(Screens.HOME_SCREEN)}
      width={1575}
      height={400}
    >
      <Dialog.CloseButton position="absolute" zIndex="1000" />
      <Fragment>
        <Box
          position="absolute"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          overflow="hidden"
          width="100%"
          padding={3}
          height={400}
          top={0}
          left={0}
          bottom={0}
        >
          <Heading>Settings</Heading>
          <Text variant="paragraph">
            Please configure all the settings below.
          </Text>
          <FormField label="Table for Source data">
            <TablePickerSynced globalConfigKey="selectedSourceTableId" />
          </FormField>
          <FormField
            label="Field which has Source Text, Attachment, URL or Video"
            marginBottom={0}
          >
            <FieldPickerSynced
              table={sourceTable}
              globalConfigKey="selectedFieldId"
              placeholder="Pick a 'text' field..."
              onChange={(field) => {
                if (field) {
                  setSelectedFieldId(field.id);
                  setSelectedFieldType(field.type);
                }
              }}
              allowedTypes={[
                FieldType.MULTILINE_TEXT,
                FieldType.URL,
                FieldType.MULTIPLE_ATTACHMENTS,
              ]}
            />
          </FormField>
          <FormField label="Table to store Quiz">
            <TablePickerSynced globalConfigKey="selectedQuizTableId" />
          </FormField>
          <Button
            onClick={() => setVisibleScreen(Screens.HOME_SCREEN)}
            marginTop={2}
            width="100px"
            variant="primary"
            size="large"
            icon="thumbsUp"
          >
            Done
          </Button>
        </Box>
      </Fragment>
    </Dialog>
  );
}
initializeBlock(() => <QuizGenerationBlock />);
