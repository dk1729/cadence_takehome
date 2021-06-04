import _ from "lodash";

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        open: action.open,
      }
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        search_term: action.search_term,
      }
    case 'SET_SELECTED_COLUMN':
      return {
        ...state,
        selected_option: action.selected_option,
      }
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.new_current,
      }
    case 'FILL':
      return {
        ...state,
        data: action.new_data,
      }
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        return {
          ...state,
          data: state.data.slice().reverse(),
          direction:
            state.direction === 'ascending' ? 'descending' : 'ascending',
        }
      }

      return {
        column: action.column,
        data: _.sortBy(state.data, [action.column]),
        direction: 'ascending',
      }
    default:
      throw new Error()
  }
};

export default reducer;