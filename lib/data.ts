import { prisma } from "./prisma";
import { escapeRegex } from "./utils";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

/**
 * The number of items to display
 * per page in the comps table.
 * 
 * @constant ITEMS_PER_PAGE
 * @type {number} The number of items per page.
 * @default 8 items per page
 */
const ITEMS_PER_PAGE = 8;

/**
 * Fetches the total number of comps in the database.
 */
export async function fetchCompsPages(q: string) {
  const query = escapeRegex(q);

  try {
    const count = await prisma.comp.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            type: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      }
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of comps.');
  }
}

/**
 * Fetches a list of comps from the database.
 * 
 * @param q The search query.
 * @param currentPage The current page number.
 * @returns A list of comps.
 */
export async function fetchFilteredComps(q: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const query = escapeRegex(q);

  try {
    // ORDER BY comps.createdAt DESC
    return await prisma.comp.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            type: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: offset,
      take: ITEMS_PER_PAGE
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comps.");
  }
}

/**
 * Fetches a single comp from the database.
 * 
 * @param id The ID of the comp.
 * @returns A single comp.
 */
export async function fetchCompById(id: string) {
  try {
    return await prisma.comp.findUnique({
      where: {
        id
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch comp.");
  }
}

export const statuses = [
  {
    id: 1,
    value: "Out of Stock",
    icon: MinusCircleIcon,
  },
  {
    id: 2,
    value: "In Stock",
    icon: CheckCircleIcon,
  }
];

export const categories = [
  { "id": 1, "name": "Resistors" },
  { "id": 2, "name": "Capacitors" },
  { "id": 3, "name": "Inductors" },
  { "id": 4, "name": "Relays" },
  { "id": 5, "name": "Switching Components" },
  { "id": 6, "name": "Sensors" },
  { "id": 7, "name": "Actuators" },
  { "id": 8, "name": "Microcontrollers" },
  { "id": 9, "name": "Integrated Circuits (ICs)" },
  { "id": 10, "name": "Transistors" },
  { "id": 11, "name": "Diodes" },
  { "id": 12, "name": "Power Supply Components" },
  { "id": 13, "name": "Connectors" },
  { "id": 14, "name": "LEDs" },
  { "id": 15, "name": "Displays" },
  { "id": 16, "name": "Motors" },
  { "id": 17, "name": "Communication Modules" },
  { "id": 18, "name": "Batteries" },
  { "id": 19, "name": "Development Boards" },
  { "id": 20, "name": "Prototyping Accessories" },
  { "id": 21, "name": "Switches" },
  { "id": 22, "name": "Passive Components" },
  { "id": 23, "name": "Active Components" },
  { "id": 24, "name": "Electromechanical Components" },
  { "id": 25, "name": "Heat Sinks" },
  { "id": 26, "name": "Cables and Wires" },
  { "id": 27, "name": "Audio Components" },
  { "id": 28, "name": "Networking Components" },
  { "id": 29, "name": "RF Components" },
  { "id": 30, "name": "Storage Components" },
  { "id": 31, "name": "Measurement Instruments" },
  { "id": 32, "name": "Single-board Computer" },
  { "id": 33, "name": "Arduino Boards" },
  { "id": 34, "name": "I²C Modules" },
  { "id": 35, "name": "Character Displays" },
  { "id": 36, "name": "Input Devices" },
  { "id": 37, "name": "Keypads" },
  { "id": 38, "name": "Membrane Switches" },
  { "id": 39, "name": "Modules" },
  { "id": 40, "name": "Cables & Connectors" },
  { "id": 41, "name": "Prototyping" },
  { "id": 42, "name": "Kits" },
  { "id": 43, "name": "Tools" },
];

export const types = [
  { "id": 1, "name": "Resistor" },
  { "id": 2, "name": "Capacitor" },
  { "id": 3, "name": "Inductor" },
  { "id": 4, "name": "Diode" },
  { "id": 5, "name": "Transistor" },
  { "id": 6, "name": "Relay" },
  { "id": 7, "name": "Integrated Circuit" },
  { "id": 8, "name": "Microcontroller" },
  { "id": 9, "name": "Sensor" },
  { "id": 10, "name": "Switch" },
  { "id": 11, "name": "Connector" },
  { "id": 12, "name": "Battery" },
  { "id": 13, "name": "Fuse" },
  { "id": 14, "name": "Potentiometer" },
  { "id": 15, "name": "Transformer" },
  { "id": 16, "name": "Oscillator" },
  { "id": 17, "name": "Voltage Regulator" },
  { "id": 18, "name": "LED" },
  { "id": 19, "name": "Display" },
  { "id": 20, "name": "Heatsink" },
  { "id": 21, "name": "Crystal" },
  { "id": 22, "name": "Module" },
  { "id": 23, "name": "Power Supply" },
  { "id": 24, "name": "Actuator" },
  { "id": 25, "name": "Filter" },
  { "id": 26, "name": "Amplifier" },
  { "id": 27, "name": "PCB Board" },
  { "id": 28, "name": "Wire" },
  { "id": 29, "name": "Fan" },
  { "id": 30, "name": "Choke" },
  { "id": 31, "name": "Rotary Encoder" },
  { "id": 32, "name": "Memory Module" },
  { "id": 33, "name": "Thermistor" },
  { "id": 34, "name": "Photodiode" },
  { "id": 35, "name": "Phototransistor" },
  { "id": 36, "name": "Optocoupler" },
  { "id": 37, "name": "Thyristor" },
  { "id": 38, "name": "Triac" },
  { "id": 39, "name": "Zener Diode" },
  { "id": 40, "name": "Varistor" },
  { "id": 41, "name": "Bridge Rectifier" },
  { "id": 42, "name": "Logic Gate" },
  { "id": 43, "name": "Motor" },
  { "id": 44, "name": "Stepper Motor" },
  { "id": 45, "name": "Servo Motor" },
  { "id": 46, "name": "Piezoelectric Element" },
  { "id": 47, "name": "Buzzer" },
  { "id": 48, "name": "Current Transformer" },
  { "id": 49, "name": "Hall Effect Sensor" },
  { "id": 50, "name": "Proximity Sensor" },
  { "id": 51, "name": "Gas Sensor" },
  { "id": 52, "name": "Humidity Sensor" },
  { "id": 53, "name": "Pressure Sensor" },
  { "id": 54, "name": "Temperature Sensor" },
  { "id": 55, "name": "Accelerometer" },
  { "id": 56, "name": "Gyroscope" },
  { "id": 57, "name": "Magnetometer" },
  { "id": 58, "name": "RFID Module" },
  { "id": 59, "name": "Bluetooth Module" },
  { "id": 60, "name": "Wi-Fi Module" },
  { "id": 61, "name": "GPS Module" },
  { "id": 62, "name": "NFC Module" },
  { "id": 63, "name": "Arduino" },
  { "id": 64, "name": "Raspberry Pi" },
  { "id": 65, "name": "ESP8266" },
  { "id": 66, "name": "ESP32" },
  { "id": 67, "name": "BeagleBone" },
  { "id": 68, "name": "STM32 Board" },
  { "id": 69, "name": "Development Board" },
  { "id": 70, "name": "Single-board Computer" },
  { "id": 71, "name": "Microcontroller Board" },
  { "id": 72, "name": "Display Module" },
  { "id": 73, "name": "Input Device" },
  { "id": 74, "name": "Cables & Connectors" },
  { "id": 75, "name": "Prototyping Tools" },
  { "id": 76, "name": "Measurement Tools" },
];