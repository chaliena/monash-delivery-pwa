export class Driver {
    name: string;
    department: 'food' | 'furniture' | 'electronic'; // Using union type for enum
    licenceNumber: string;
    isActive: boolean;
    createdAt: Date;
    _id: string; // MongoDB ID
    id: string; // Unique identifier (if needed separately)
    assigned_packages: string[]; // Array of assigned package IDs

    constructor(

    ) {
        this.name = '';
        this.department = 'food';
        this.licenceNumber = '';
        this.isActive = true;
        this.createdAt = new Date(); // Set to the current date
        this.id = ''; // Assign the unique ID
        this._id = ''; // Assign the MongoDB ID
        this.assigned_packages = []; // Initialize the assigned packages
    }
}
