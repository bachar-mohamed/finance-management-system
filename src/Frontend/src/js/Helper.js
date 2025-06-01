const REQUEST = async function (method, token, url, body_content = null) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const options = {
    method: method.toUpperCase(),
    headers: headers,
  };
  if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "DELETE" && body_content) {
    options.body = JSON.stringify(body_content);
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    options.signal = controller.signal;
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMsg = errorBody.message || errorMsg;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error.message);
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

const AUTH_REQUEST = async function (method, url, body_content = {}) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body_content),
  };
  const result = await fetch(url, options);
  return result;
};

export { REQUEST, AUTH_REQUEST };
