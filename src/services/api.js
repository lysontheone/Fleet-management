import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Change this to your backend URL
const ADMIN_TOKEN = 'changeme'; // Change this to your admin token

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-admin-token': ADMIN_TOKEN,
  },
});

export const fetchDashboardStats = async () => {
  try {
    const [driversRes, carsRes, paymentsRes] = await Promise.all([
      api.get('/drivers'),
      api.get('/cars'),
      api.get('/payments'),
    ]);

    const drivers = driversRes.data;
    const cars = carsRes.data;
    const payments = paymentsRes.data;

    const activeDrivers = drivers.filter(d => d.status === 'active').length;
    const activeCars = cars.filter(c => c.status === 'active').length;
    const totalOutstanding = payments.reduce((sum, p) => sum + (p.balance || 0), 0);

    return {
      activeDrivers,
      activeCars,
      totalOutstanding,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      activeDrivers: 0,
      activeCars: 0,
      totalOutstanding: 0,
    };
  }
};

export const fetchDrivers = async () => {
  try {
    const response = await api.get('/drivers');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
};

export const fetchCars = async () => {
  try {
    const response = await api.get('/cars');
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const fetchPayments = async () => {
  try {
    const response = await api.get('/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
};