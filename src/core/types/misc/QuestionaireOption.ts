export type Option = {
  questionId: string | number
  optionId: string | number
  optionText: string
  nextQuestionId: number[] | null
}
