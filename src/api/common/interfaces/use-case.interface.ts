interface IUseCase {
  specifications?: Record<string, any>;
  execute(params?: any): Promise<any>;
}

const USE_CASE_TYPE = Symbol.for('IUseCase');

export { IUseCase, USE_CASE_TYPE };
