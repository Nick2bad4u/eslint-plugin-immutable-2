interface Service {
    run(input: string): string;
}

const service: Service = {
    run: (input) => input.trim(),
};

let count = 0;
count += 1;

export const value = service.run(" hello ");
