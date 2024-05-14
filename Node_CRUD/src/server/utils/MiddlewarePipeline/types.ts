export type TNext = () => Promise<void> | void;

export type TMiddleware<TRequest, TResponse> = (
  req: TRequest,
  res: TResponse,
  next: TNext
) => Promise<void> | void;
