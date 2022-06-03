export class CsvParameter {
  constructor(
    public fieldTobeExport: string,
    public operator: number,
    public columnNumber: number,
    public object: string
  ) {}
}
