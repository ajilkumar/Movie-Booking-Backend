// utils/generateSeats.js

export const generateSeats = () => {
  const layout = [
    { row: "A", type: "VIP", price: 300 },
    { row: "B", type: "VIP", price: 300 },
    { row: "C", type: "Premium", price: 250 },
    { row: "D", type: "Premium", price: 250 },
    { row: "E", type: "Premium", price: 250 },
    { row: "F", type: "Regular", price: 200 },
    { row: "G", type: "Regular", price: 200 },
    { row: "H", type: "Regular", price: 200 },
    { row: "I", type: "Regular", price: 200 },
    { row: "J", type: "Regular", price: 200 },
  ];

  const seatsPerRow = 10;
  const seats = [];

  layout.forEach(({ row, type, price }) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        seatNumber: `${row}${i}`,
        seatType: type,
        price: price,
      });
    }
  });

  return seats;
};
