// eslint-disable-next-line import/prefer-default-export
export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/app',
  BOARD: (boardId, layerId) => `/app/board/${boardId}${layerId ? `/layer/${layerId}` : ''}`,
  BOARD_MATCH: `/app/board/:boardId/layer/:layerId`,
  VIOLATIONS: '/violations',
};
