import serviceHandler from "../core/services/serviceHandler";

export const SnippetCreate = async (snippet) => {
  var res = await serviceHandler.post(`snippets`, JSON.stringify(snippet));
  return res;
};

export const UpdateSnippet = async (snippet) => {
  var res = await serviceHandler.put(`snippets`, JSON.stringify(snippet));
  return res;
};

export const GetSnippets = async (query) => {
  var res = await serviceHandler.get(`snippets${query}`);
  console.log("test##",res);
  return res;
};

export const GetSnippetsBriefList = async () => {
  var res = await serviceHandler.get(`snippets/brief`);
  return res;
};

export const GetSnippet = async (snippetId) => {
  var res = await serviceHandler.get(`snippets/${snippetId}`);
  return res;
};
export const GetSnippetLivePreivew = async (snippetId) => {
  var res = await serviceHandler.get(`livePreview/${snippetId}`);
  return res;
};

export const GetSnippetUpdateView = async (snippetId) => {
  var res = await serviceHandler.get(`snippets/${snippetId}/u`);
  return res;
};

export const GetSnippetBySlug = async (slug) => {
  var res = await serviceHandler.get(`snippets/${slug}/slug`);
  return res;
};
export const GetSnippetBySlugLive = async (slug) => {
  var res = await serviceHandler.get(`snippets/${slug}/slugLive`);
  return res;
};

export const GetHTML = async (slug) => {
  var res = await serviceHandler.get(`live/${slug}`);
  return res;
};

export const UpdateSnippetStatus = async (snippet) => {
  var res = await serviceHandler.put(
    `snippets/status`,
    JSON.stringify(snippet)
  );
  return res;
};

export const GetSnippetHtmlCode = async (snippetId, emailPlatformCode) => {
  var res = await serviceHandler.get(
    `snippets/${snippetId}/html?emailPlatform=${emailPlatformCode}`
  );
  return res;
};

export const deleteSnippetId = async (snippet) => {
  var res = await serviceHandler.post(
    `Snippets/snippetId`,
    JSON.stringify(snippet)
  );
  return res;
};


