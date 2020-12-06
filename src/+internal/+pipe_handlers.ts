import { InternalConfig, Operation, OperationFactory, OperationFactoryDecorator } from "./+types";

export default function pipe_handlers<TArgs extends any[], TResult>(
    configurations: OperationFactoryDecorator<TArgs, TResult>[],
    factory: OperationFactory<TArgs, TResult>
): OperationFactory<TArgs, TResult> {
    return config => {
        factory = configurations.reduce((factory, decorator) => decorator(factory), factory);
        const handler = factory(config);

        return (...args: TArgs) => {
            return handler(...args); 
        }
    }
}