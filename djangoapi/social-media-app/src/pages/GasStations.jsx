import React, { useEffect } from "react";
import useSWR from "swr";
import { Table, Spinner, Alert } from "react-bootstrap";
import Layout from "../components/Layout";
import { fetcher } from "../helpers/axios";

function getCheapestPrice(stations, fuelType) {
  if (!stations || stations.length === 0) return null;

  const prices = stations
    .map((station) => station.fuel_prices?.[fuelType])
    .filter((price) => typeof price === "number");

  return prices.length > 0 ? Math.min(...prices) : null;
}

function getFuelNeeded(cars) {
  if (!cars || cars.length === 0) return null;

  const tankCapacity = cars.map((car) => car.tank_capacity);
  const currentFuel = cars.map((car) => car.current_fuel);
  const fuelNeeded = cars.map((car) => car.tank_capacity - car.current_fuel);

  console.log("Tank capacities:", tankCapacity);
  console.log("Current fuel:", currentFuel);
  console.log("Fuel needed:", fuelNeeded);

  return { tankCapacity, currentFuel, fuelNeeded };
}

function GasStations() {
  const {
    data: stations,
    error: stationError,
    isLoading: stationLoading,
  } = useSWR("/gasstation/stations/", fetcher);

  const { data: cars } = useSWR("/gasstation/cars/", fetcher);

  const cheapestDiesel = getCheapestPrice(stations, "diesel");
  const cheapestPetrol = getCheapestPrice(stations, "petrol");
  const cheapestElectric = getCheapestPrice(stations, "electric");

  useEffect(() => {
    if (cars) {
      getFuelNeeded(cars);
    }
  }, [cars]);

  return (
    <Layout>
      <h4 className="mb-4">Gas Stations</h4>

      {stationLoading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading gas stations...</p>
        </div>
      )}

      {stationError && (
        <Alert variant="danger">Failed to load gas stations.</Alert>
      )}

      {stations && stations.length > 0 && (
        <>
          {/* All stations */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Station Name</th>
                <th>Diesel Price</th>
                <th>Petrol Price</th>
                <th>Electric Price</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id}>
                  <td>{station.name}</td>
                  <td>{station.fuel_prices?.diesel}</td>
                  <td>{station.fuel_prices?.petrol}</td>
                  <td>{station.fuel_prices?.electric}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4 className="mb-4">Cheapest prices</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Station Name</th>
                <th>Cheapest Diesel Price</th>
                <th>Cheapest Petrol Price</th>
                <th>Cheapest Electric Price</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => {
                const dieselMatch =
                  station.fuel_prices?.diesel === cheapestDiesel;
                const petrolMatch =
                  station.fuel_prices?.petrol === cheapestPetrol;
                const electricMatch =
                  station.fuel_prices?.electric === cheapestElectric;

                if (!dieselMatch && !petrolMatch && !electricMatch) return null;

                return (
                  <tr key={station.id}>
                    <td>{station.name}</td>
                    <td>{dieselMatch ? station.fuel_prices?.diesel : ""}</td>
                    <td>{petrolMatch ? station.fuel_prices?.petrol : ""}</td>
                    <td>{electricMatch ? station.fuel_prices?.electric : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <h4 className="mb-4">Cars</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Tank Capacity</th>
                <th>Current Fuel</th>
                <th>Fuel Needed</th>
              </tr>
            </thead>
            <tbody>
              {cars &&
                cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.brand}</td>
                    <td>{car.tank_capacity}</td>
                    <td>{car.current_fuel}</td>
                    <td>{car.tank_capacity - car.current_fuel}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}

      {!stationLoading && (!stations || stations.length === 0) && (
        <p>No gas stations found.</p>
      )}
    </Layout>
  );
}

export default GasStations;