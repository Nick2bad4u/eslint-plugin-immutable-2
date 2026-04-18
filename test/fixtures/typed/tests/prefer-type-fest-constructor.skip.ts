interface QueueClient {
    enqueue(message: string): void;
}

type QueueClientConstructor = new (
    queueName: string,
    retryCount: number
) => QueueClient;

type QueueClientFromCtor = InstanceType<QueueClientConstructor>;

JSON.stringify({} as QueueClientFromCtor);

export const __typedFixtureModule = "typed-fixture-module";
