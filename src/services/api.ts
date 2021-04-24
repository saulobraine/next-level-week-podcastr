import axios from "axios";

export const api = axios.create({
  baseURL: 'https://saulobraine-podcastr-api.herokuapp.com/',
})