export interface UpdateDriver {
    id: string; // The driver's ID
    driver_licence: string; // Updated licence number
    driver_department: 'food' | 'furniture' | 'electronic'; // Updated department
}
