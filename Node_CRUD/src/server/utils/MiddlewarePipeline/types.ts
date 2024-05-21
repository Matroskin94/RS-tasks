export type TNext<TRequest, TResponse> = () => void;

export type TMiddleware<TRequest, TResponse> = (
  req: TRequest,
  res: TResponse,
  next: TNext<TRequest, TResponse>
) => Promise<void> | void;
