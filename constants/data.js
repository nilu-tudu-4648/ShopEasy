export const vehicles = [
  {
    id: "1",
    name: "Toyota Camry",
    price: "2000",
    location: "New York", 
    rating: 4.5,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
      "https://images.unsplash.com/photo-1621007947389-f4dbaa0b3fc4", 
      "https://images.unsplash.com/photo-1621007947395-f29d8351c429"
    ],
    features: ["Automatic", "5 Seats", "Air Conditioning", "GPS Navigation"],
    description: "The Toyota Camry is a reliable and comfortable sedan perfect for both city driving and long trips.",
    specifications: {
      engine: "2.5L 4-cylinder",
      transmission: "8-speed automatic",
      fuelType: "Petrol",
      mileage: "28 mpg city / 39 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Honda Civic",
    price: "1000",
    location: "Los Angeles",
    rating: 4.3,
    status: "available", 
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
      "https://images.unsplash.com/photo-1533473359335-0135ef1b58bf",
      "https://images.unsplash.com/photo-1533473359338-0135ef1b58bf"
    ],
    features: ["Manual", "5 Seats", "Air Conditioning", "Bluetooth"],
    description: "The Honda Civic offers excellent fuel economy and a fun driving experience in a compact package.",
    specifications: {
      engine: "1.5L Turbo 4-cylinder",
      transmission: "6-speed manual",
      fuelType: "Petrol",
      mileage: "32 mpg city / 42 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Tesla Model 3",
    price: "1200",
    location: "San Francisco",
    rating: 4.8,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea90",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea91"
    ],
    features: ["Electric", "5 Seats", "Autopilot", "Premium Sound"],
    description: "The Tesla Model 3 is an all-electric vehicle with cutting-edge technology and impressive range.",
    specifications: {
      engine: "Electric Motor",
      transmission: "Single-speed",
      fuelType: "Electric",
      range: "358 miles"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "BMW 3 Series",
    price: "1300",
    location: "Chicago",
    rating: 4.6,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e",
      "https://images.unsplash.com/photo-1555215695-3004980ad54f",
      "https://images.unsplash.com/photo-1555215695-3004980ad54g"
    ],
    features: ["Automatic", "5 Seats", "Leather Seats", "Sport Mode"],
    description: "The BMW 3 Series combines luxury with sporty performance for an engaging driving experience.",
    specifications: {
      engine: "2.0L Turbo 4-cylinder",
      transmission: "8-speed automatic",
      fuelType: "Petrol",
      mileage: "26 mpg city / 36 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "Mercedes C-Class",
    price: "1400",
    location: "Miami",
    rating: 4.7,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c342",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c343"
    ],
    features: ["Automatic", "5 Seats", "Premium Audio", "Panoramic Roof"],
    description: "The Mercedes C-Class delivers luxury, comfort and sophisticated technology in a stylish package.",
    specifications: {
      engine: "2.0L Turbo 4-cylinder",
      transmission: "9-speed automatic",
      fuelType: "Petrol",
      mileage: "24 mpg city / 33 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    name: "Audi A4",
    price: "1500",
    location: "Seattle",
    rating: 4.4,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1541348263662-e068662d82af",
      "https://images.unsplash.com/photo-1541348263662-e068662d82ag",
      "https://images.unsplash.com/photo-1541348263662-e068662d82ah"
    ],
    features: ["Automatic", "5 Seats", "Quattro AWD", "Virtual Cockpit"],
    description: "The Audi A4 offers refined handling and cutting-edge technology in a sophisticated design.",
    specifications: {
      engine: "2.0L Turbo 4-cylinder",
      transmission: "7-speed automatic",
      fuelType: "Petrol",
      mileage: "25 mpg city / 34 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "7",
    name: "Lexus ES",
    price: "1700",
    location: "Boston",
    rating: 4.5,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9c",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9d"
    ],
    features: ["Automatic", "5 Seats", "Premium Sound", "Safety System+"],
    description: "The Lexus ES combines luxury and reliability with exceptional comfort and refinement.",
    specifications: {
      engine: "3.5L V6",
      transmission: "8-speed automatic",
      fuelType: "Petrol",
      mileage: "22 mpg city / 32 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "8",
    name: "Hyundai Sonata",
    price: "1800",
    location: "Houston",
    rating: 4.2,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0",
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf1",
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf2"
    ],
    features: ["Automatic", "5 Seats", "Apple CarPlay", "Smart Cruise"],
    description: "The Hyundai Sonata offers great value with modern features and comfortable driving dynamics.",
    specifications: {
      engine: "2.4L 4-cylinder",
      transmission: "8-speed automatic",
      fuelType: "Petrol",
      mileage: "28 mpg city / 38 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "9",
    name: "Volkswagen Passat",
    price: "1900",
    location: "Denver",
    rating: 4.3,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35e",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35f"
    ],
    features: ["Automatic", "5 Seats", "Android Auto", "Adaptive Cruise"],
    description: "The Volkswagen Passat delivers German engineering with spacious comfort and reliability.",
    specifications: {
      engine: "2.0L Turbo 4-cylinder",
      transmission: "6-speed automatic",
      fuelType: "Petrol",
      mileage: "24 mpg city / 36 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "10",
    name: "Nissan Altima",
    price: "2000",
    location: "Phoenix",
    rating: 4.1,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1558383331-f520f2888351",
      "https://images.unsplash.com/photo-1558383331-f520f2888352",
      "https://images.unsplash.com/photo-1558383331-f520f2888353"
    ],
    features: ["Automatic", "5 Seats", "ProPILOT Assist", "Remote Start"],
    description: "The Nissan Altima combines efficiency and technology with comfortable daily driving.",
    specifications: {
      engine: "2.5L 4-cylinder",
      transmission: "CVT automatic",
      fuelType: "Petrol",
      mileage: "28 mpg city / 39 mpg highway"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const routeNames = {
  HomeScreen: "HomeScreen",
  VehicleDetailsScreen: "VehicleDetailsScreen",
  BookingConfirmationScreen: "BookingConfirmationScreen",
  MyBookingsScreen: "MyBookingsScreen",
  LoginScreen: "LoginScreen",
  RegisterScreen: "RegisterScreen",
  ForgotPasswordScreen: "ForgotPasswordScreen",
  ResetPasswordScreen: "ResetPasswordScreen",
  ProfileScreen: "ProfileScreen",
  PaymentScreen: "PaymentScreen",
  HelpSupportScreen: "HelpSupportScreen",
  MyVehiclesScreen: "MyVehiclesScreen",
};
