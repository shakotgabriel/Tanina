import axios from "axios";
import { API_URL } from "../../config";

console.log(API_URL);

export const apiClient = axios.create({
    baseURL: API_URL,
});

export const authAxios = axios.create({
    baseURL: API_URL,
});
