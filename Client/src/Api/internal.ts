import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface LoginData {
  username: string;
  password: string;
}
interface SignupData {
  username: string;
  password: string;
  email: string;
  name: string;
  confirmPassword: string;
 
}

interface UserResponse {
  auth: any;
  user: {
    _id: string;
    email: string;
    username: string;
    auth: boolean;
  };
  token: string;
}

interface ErrorResponse {
  message: string;
}

interface GenericResponse {
  message: string;
}


export const login = async (data: LoginData): Promise<UserResponse | ErrorResponse> => {
  try {
    const response = await api.post<UserResponse>('/login', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the error response from the server
    }
    return { message: 'An unknown error occurred' }; // Return a generic error message
  }
};


export const signup = async (data: SignupData): Promise<UserResponse | ErrorResponse> => {
  try {
    const response = await api.post<UserResponse>('/register', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the error response from the server
    }
    return { message: 'An unknown error occurred' }; // Return a generic error message
  }
};


export const signout = async (): Promise<GenericResponse | ErrorResponse> => {
  try {
    const response = await api.post<GenericResponse>('/logout');
    return response.data;
  } catch (error: any) {
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


export const postBlog = async(data)=>{
  try {
    const response = await api.post('/blog',data);
    console.log('axios response', response);
    return response;
  } catch (error) {
    return error
    
  }
 
};

// getblogs id apiendpoint

export const getBlogId = async(id)=>{
  try {
    const response = await api.get(`/blog/${id}`, {validateStatus: false})
    return response;
  } catch (error) {
    return error;
  }
};


// get comment endpoint 

export const getCommentsById = async(id)=>{
  try {
    const response = await api.get(`/comment/${id}`, {validateStatus: false})
    return response;
  } catch (error) {
    return error;
  }
}

// post comment endpoint api 

export const postCommet = async(data)=>{
  try {
    const response = await api.post('/comment', data);
    console.log("comment api axios", response)
    return response;
  } catch (error) {
    return error;
  }
};


// delete comment endpoint
export const deletBlog = async(id)=>{
  try {
    const response = await api.delete(`/blog/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

// update Blog endpoint
export const updateBlog = async(data)=>{
  try {
    const response = await api.put('/blog',data);
    return response;
  } catch (error) {
    return error;
  }
};




// cuto refresh token 
// protected resource 401
// api.interceptors.response.use(
//   (response) => response,  // Return the response if no error
//   async (error) => {
//     const originalReq = error.config;

//     // Check for 401 Unauthorized errors due to expired JWT
//     if (
//       error.response.status === 401 &&
//       error.response.data.message === "jwt expired" &&
//       originalReq && !originalReq._isRetry
//     ) {
//       originalReq._isRetry = true;  // Mark request as a retry attempt

//       try {
//         // Attempt to refresh the token
//         await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, {
//           withCredentials: true,
//         });

//         // Retry the original request with the new token
//         return api.request(originalReq);
//       } catch (refreshError) {
//         // Redirect to login page or handle token refresh failure
//         // For example, you can use React Router to redirect
//         window.location.href = '/login';  // Redirect to login page
//         return Promise.reject(refreshError);
//       }
//     }

//     // Return other errors
//     return Promise.reject(error);
//   }
// );


