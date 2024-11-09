export class Package {
    title: string;
    weight: number;
    destination: string;
    description?: string; // Optional property
    driverId: string; // This will store the ObjectId as a string
    isAllocated: boolean;
    createdAt: Date;
    _id: string; // MongoDB ID
    id: string; // Unique identifier

    constructor(
    ) {
        this.title = '';
        this.weight = 0;
        this.destination = '';
        this.driverId = '';
        this.isAllocated = false;
        this.description = '';
        this.createdAt = new Date(); // Set to current date
        this.id = ''; // Assign the unique ID
        this._id = ''; // Assign the MongoDB ID    
}}
