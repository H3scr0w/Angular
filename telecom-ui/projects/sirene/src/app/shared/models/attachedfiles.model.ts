export class Attachedfiles {
  constructor(
    public filesId: number = 0,
    public siteCode: string = '',
    public filesPath: string = '',
    public application: string = '',
    public extension: string = '',
    public filename: string = '',
    public requestId: number = 0,
    public waitingId: number = 0,
    public file: File = null
  ) {}
}
