// eslint-disable-next-line import/prefer-default-export
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/app',
  BOARD: boardId => `/app/board/${boardId}`,
  BOARD_MATCH: `/app/board/:docId`
};
