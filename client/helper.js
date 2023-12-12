/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorMessage').classList.remove('hidden');
  document.getElementById('successMessage').classList.add('hidden');
};

// TODO: definitely better was to do this than to copy code but didn't have time to refactor yet since they're called differently
const handleSuccess = (result) => {
  document.getElementById('successMessage').textContent = result.message;
  document.getElementById('successMessage').classList.remove('hidden');
}
  
  /* Sends post requests to the server using fetch. Will look for various
     entries in the response JSON object, and will handle them appropriately.
  */
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = response.status === 204 ? {} : await response.json();
  document.getElementById('errorMessage').classList.add('hidden');
  document.getElementById('successMessage').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (handler) {
    if (handler.params) {
      handler.funct(handler.params);
    }
    else {
      handler(result);
    }
  }
  
  if (result.error) {
    handleError(result.error);
  }
};

const hideError = () => {
    document.getElementById('errorMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    handleSuccess,
    sendPost,
    hideError,
};