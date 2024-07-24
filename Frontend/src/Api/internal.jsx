import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (data) => {
  try {
    const response = await api.post('/login', data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the error response from the server
    }
    return { message: 'An unknown error occurred' }; // Return a generic error message
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the error response from the server
    }
    return { message: 'An unknown error occurred' }; // Return a generic error message
  }
};

export const signout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the error response from the server
    }
    return { message: 'An unknown error occurred' }; // Return a generic error message
  }
};

export const getAllblog = async () => {
  try {
    const response = await api.get('/blog/all');
    console.log('Axios Response:', response); // Log full axios response
    return response; // Ensure we return the full response object
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { message: 'An unknown error occurred' };
  }
};

export const postBlog = async (data) => {
  // const token = localStorage.getItem('authToken');
  try {
    const response = await api.post('/blog', data /*, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    }*/);
    console.log('axios response', response);
    return response;
  } catch (error) {
    return error;
  }
};

export const getBlogId = async (id) => {
  try {
    const response = await api.get(`/blog/${id}`, { validateStatus: false });
    return response;
  } catch (error) {
    return error;
  }
};

export const getCommentsById = async (id) => {
  try {
    const response = await api.get(`/comment/${id}`, { validateStatus: false });
    return response;
  } catch (error) {
    return error;
  }
};

export const postCommet = async (data) => {
  try {
    const response = await api.post('/comment', data);
    console.log("comment api axios", response);
    return response;
  } catch (error) {
    return error;
  }
};

export const deletBlog = async (id) => {
  try {
    const response = await api.delete(`/blog/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateBlog = async (data) => {
  try {
    const response = await api.put('/blog', data);
    return response;
  } catch (error) {
    return error;
  }
};

// Uncomment and adjust the following code if needed for token refresh

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalReq = error.config;

//     if (
//       error.response.status === 401 &&
//       error.response.data.message === "jwt expired" &&
//       originalReq && !originalReq._isRetry
//     ) {
//       originalReq._isRetry = true;

//       try {
//         await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, {
//           withCredentials: true,
//         });

//         return api.request(originalReq);
//       } catch (refreshError) {
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
