export const LANDING_ROUTE = '/public';
export const READ_STORY_ROUTE = '/public/read/:storyId';

export const ADMIN_ROUTE = '/admin';
export const ADMIN_STORIES_ROUTE = '/admin/stories';
export const ADMIN_STORY_VIEW_ROUTE = '/admin/stories/:id';

export const NOT_FOUND_ROUTE = '/404';

export const makePath = (path, args) => {
  let result = path;
  Object.keys(args).forEach(key => {
    result = result.replace(key, args[key]);
  });
  return result;
};

export const makeReadStoryPath = (storyId, withOrigin = false) => {
  let path = '';
  if (withOrigin) {
    path += window.location.origin;
  }
  path += makePath(
    READ_STORY_ROUTE,
    {
      ':storyId': storyId
    }
  );
  return path;
};
