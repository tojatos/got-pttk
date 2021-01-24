export const API_URL =
  process.env.REACT_APP_API_URL || "http://got-pttk.icu/api";
export const TOKEN_URL = `${API_URL}/token/`;
export const ROLE_URL = `${API_URL}/role/`;
export const POINTS_URL = `${API_URL}/points/`;
export const MOUNTAIN_GROUPS_URL = `${API_URL}/mountain_groups/`;
export const SEGMENTS_URL = `${API_URL}/segments/`;
export const SEGMENTS_URL_ID = (id: number) => `${API_URL}/segments/${id}/`;
export const USER_SEGMENTS_URL = `${API_URL}/user_segments/`;
export const ROUTE_URL = `${API_URL}/route/`;
export const ROUTE_URL_ID = (id: number) => `${API_URL}/route/${id}/`;
export const ROUTES_TO_VERIFY_URL = `${API_URL}/routes_to_verify/`;
export const VERIFY_URL = `${API_URL}/verify/`;
export const VERIFIED_MOUNTAIN_GROUPS_URL = (id: number) =>
  `${API_URL}/route_verified_groups/${id}`;
