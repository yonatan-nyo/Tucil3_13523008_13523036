const deepCopy = <T>(arr: T[][]): T[][] => arr.map((row) => [...row]);

export default deepCopy;
