const successResponse = (data: any, message?: string) => {
  return {
    success: true,
    message: message || 'success',
    data: data || {},
    error: {},
  };
};

const errorResponse = (message: string | Array<string>, error?: any) => {
  return {
    success: false,
    message,
    data: {},
    error: error || {},
  };
};
export { errorResponse, successResponse };
