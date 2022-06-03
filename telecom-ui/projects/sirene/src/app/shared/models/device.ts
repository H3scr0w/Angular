/**
 * The Device model
 */
export class Device {
  constructor(
    public id: string = null,
    public orderId: string = '',
    public sgtConnectionCode: string = '',
    public sgtDeviceName: string = '',
    public status: string = ''
  ) {}
}
