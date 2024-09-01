import { Option } from "@/core/types/misc/QuestionaireOption";

export const searchSelectedNextQuestion = (arrayData: Option[]) => {
  let arrayFinal: number[] = [];
  arrayData.forEach((val) => {
    if (val.nextQuestionId) {
      arrayFinal = [...arrayFinal, ...val.nextQuestionId];
    }
  });
  return arrayFinal;
};

export const filterFromEliminateQuestion = (
  decidedFlow: number[][],
  deletedFlow: number,
) => {
  return decidedFlow.filter((flow) => {
    if (flow) {
      return flow.includes(deletedFlow);
    }
    return false;
  });
};

export const filterEliminateQuestion = (
  eliminateQuestion,
  nextQuestion,
  initQuestions,
  questionNow,
) => {
  return eliminateQuestion.filter((val) => {
    if (nextQuestion.includes(val)) {
      return false;
    } else {
      const questionEliminate = initQuestions.find((question) => {
        return question.questionId == val;
      });
      if (questionEliminate?.isShown) {
        const questionEliminateNo = questionEliminate.questionNo.split(".");
        questionEliminateNo.pop();
        if (questionEliminateNo.join(".") != questionNow.questionNo) {
          return false;
        }
      }
      return true;
    }
  });
};

export const getListDecidedFlow = (questionFlow, QuestionNow) => {
  const decidedFlow: number[][] = [];
  for (const questionId in questionFlow) {
    if (questionId != QuestionNow.questionId) {
      decidedFlow.push(questionFlow[questionId]);
    }
  }
  return decidedFlow;
};

export const isSameNumber = (prevQuestion, selectedQuestion) => {
  if (prevQuestion) {
    const prevNo = prevQuestion.questionNo.split(".");
    if (prevNo && prevNo.length > 0) {
      prevNo.pop();
    }
    if (selectedQuestion?.questionNo != prevNo.join(".")) {
      return true;
    }
  }
  return false;
};

export const isNoNextQuestion = (id: number[] | number) => {
  return (
    (id.constructor !== Array && id) ||
    (id.constructor === Array && id.length != 0)
  );
};

export const isNextWillDeleted = (selectedQuestion, sameNumber, val) => {
  return !selectedQuestion?.isShown && sameNumber && val != -1;
};

export const searchForSameNumber = (
  prevNumber,
  selectedQuestion,
  initQuestions,
) => {
  if (prevNumber.constructor === Array) {
    for (const pr of prevNumber) {
      const prevQuestion = initQuestions.find((q) => {
        return q.questionId == pr;
      });
      return isSameNumber(prevQuestion, selectedQuestion);
    }
  } else {
    const prevQuestion = initQuestions.find((q) => {
      return q.questionId == prevNumber;
    });
    return isSameNumber(prevQuestion, selectedQuestion);
  }
};

export const mergeNextNumber = (nextList, nextNumbers) => {
  if (nextNumbers) {
    return [...nextList, ...nextNumbers];
  }
  return nextList;
};

export const nullAnswer = (answer) => {
  return answer && answer.constructor === Array ? [] : "";
};

export const getNextandEliminateQuestion = (question, answer, initQuestion) => {
  const optionSelected: Option[] = [];
  const optionNotSelected: Option[] = [];
  question.options.map((val) => {
    if (
      (answer.constructor === Array && answer.includes(val.optionText)) ||
      (answer.constructor !== Array && val.optionText == answer)
    ) {
      optionSelected.push(val);
    } else {
      optionNotSelected.push(val);
    }
  });

  const nextQuestion: number[] = searchSelectedNextQuestion(optionSelected);
  let eliminateQuestion: number[] =
    searchSelectedNextQuestion(optionNotSelected);

  eliminateQuestion = [...new Set(eliminateQuestion)];
  eliminateQuestion = filterEliminateQuestion(
    eliminateQuestion,
    nextQuestion,
    initQuestion,
    question,
  );

  return {
    nextQuestion,
    eliminateQuestion,
  };
};

export const deletedFlowfromDecided = (flow, question, eliminateQuestion) => {
  const decidedFlow: number[][] = getListDecidedFlow(flow, question);
  return filterFromEliminateQuestion(decidedFlow, eliminateQuestion);
};

export const isNumberDelete = (initQuestion, val, prev) => {
  const selectedQuestion = initQuestion.find((q) => {
    return q.questionId == val;
  });
  const sameNumber = searchForSameNumber(prev, selectedQuestion, initQuestion);
  return isNextWillDeleted(selectedQuestion, sameNumber, val);
};
