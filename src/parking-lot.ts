export class ParkingLot implements ParkingLotPublisher {
  public occupied: number = 0;
  private subscribers: ParkingLotSubscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  enter() {
    if (!this.isFull()) {
      this.occupied++;
    } else {
      throw new Error(`the parking lot is full`);
    }
    this.notifySubscribers('enter');
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
    } else {
      throw new Error(`the parking lot is empty`);
    }
    this.notifySubscribers('leave');
  }

  private notifySubscribers(type: ParkingLotEventType): void {
    const event = {
      lotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
      type,
    };
    this.subscribers.forEach(sub => sub.onCarChange(event));
  }

  isFull() {
    return this.occupied == this.capacity;
  }

  isEmpty() {
    return this.occupied == 0;
  }

  subscribe(subscriber: ParkingLotSubscriber): void {
    if (this.subscribers.includes(subscriber)) {
      throw new Error("subscriber already subscribed")
    }
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: ParkingLotSubscriber): void {
    const i = this.subscribers.indexOf(subscriber);
    if (i < 0) {
      throw new Error("subscriber not subscribed to this lot")
    }
    this.subscribers.splice(i, 1);
  }
}

export interface ParkingLotPublisher {
  subscribe(subscriber: ParkingLotSubscriber): void;
  unsubscribe(subscriber: ParkingLotSubscriber): void;
}

export interface ParkingLotSubscriber {
  onCarChange(event: ParkingLotEvent): void;
}

export type ParkingLotEventType = 'enter' | 'leave';

export interface ParkingLotEvent {
  readonly lotName: string,
  readonly occupied: number,
  readonly capacity: number,
  readonly type: ParkingLotEventType
}