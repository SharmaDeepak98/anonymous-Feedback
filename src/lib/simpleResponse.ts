const simpleResponse = (success: boolean, message: string, status: number) => {
  return Response.json(
    {
      success,
      message,
    },
    {
      status,
    }
  );
};
export default simpleResponse;
