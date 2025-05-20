const successResponse = (data: any, message?: string) => {
  return {
    success: true,
    message: message || 'success',
    data: data || {},
    error: {},
  };
};

const errorResponse = (error: any, data?: any) => {
  return {
    success: false,
    message: 'failed',
    data: data || {},
    error: error || {},
  };
};
export { errorResponse, successResponse };
