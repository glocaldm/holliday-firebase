import {createAction, createFeatureSelector, createReducer, createSelector, on, props} from '@ngrx/store';
import {GenerateContentResult, Role} from 'firebase/ai';


export interface ChatContent {
  content: string,
  role: Role
}

export interface ChatState {
  contents: Array<ChatContent>
}

const initialState: ChatState = {
  contents: []
}

export const chatActions = {
  userPrompt: createAction('[Chat] User Prompt', props<ChatContent>()),
  botOutput: createAction('[Chat] Bot Output', props<GenerateContentResult>()),
}

export const selectChatState = createFeatureSelector<ChatState>('chat')
export const chatSelectors = {
  selectAll: createSelector(
    selectChatState,
    (state): ChatContent[] => state.contents
  ),
  selectLastBot: createSelector(
    selectChatState,
    (state): ChatContent => state.contents.filter(el => el.role == "model")[-1]
  )
}
export const chatReducer = createReducer(
  initialState,
  on(
    chatActions.userPrompt,
    (state: ChatState, {content, role}): ChatState => {
      return {...state, contents: [
        ...state.contents, {role, content}
      ]};
    }
  ),
  on(
    chatActions.botOutput,
    (state: ChatState, generateContentResult: GenerateContentResult) => {
      const contents: ChatContent[] = [
        ...state.contents, {role: "model", content: generateContentResult.response.text()}
      ]
      return {...state, contents};
    }
  )
)
