export const createPageUrl = (pageName, params = {}) => {
  // Convert "SomePageName" to "some-page-name"
  const kebabCasePageName = pageName
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();
  
  let url = `/${kebabCasePageName}`;

  const queryParams = new URLSearchParams(params).toString();
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return url;
};

// Export other utility functions if needed
export default createPageUrl;