// services/hubspotService.ts

import axios from "axios";

const HUBSPOT_ACCESS_TOKEN = "REMOVED";
const BASE_URL = "https://api.hubapi.com";

const hubspotService = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

interface HubSpotUser {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    [key: string]: any;
  };
}

export const getUserByEmail = async (email: string): Promise<HubSpotUser | null> => {
  try {
    const response = await hubspotService.get(`/crm/v3/objects/contacts/${email}?dataSensitivity=sensitive`, {
      params: {
        idProperty: "email",
      },
    });
    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        // Ensure it is the object's own property
        console.log(key + ": " + response.data[key]);
      }
    }
    console.log("Returning: " + (Object.keys(response.data.properties).length > 0 ? response.data.properties : null));
    return Object.keys(response.data.properties).length > 0 ? response.data.properties : null;
    //return response.data.properties;
  } catch (error) {
    console.error("Error fetching user data from HubSpot:", error);
    throw error;
  }
};

export const getUserLeadDetailsByEmail = async (email: string): Promise<HubSpotUser | null> => {
  try {
    const properties = "arch_type,medical_waiver_sent,medical_waiver_signed,firstname, lastname";
    const response = await hubspotService.get(`/crm/v3/objects/contacts/${email}?dataSensitivity=sensitive&properties=${properties}`, {
      params: {
        idProperty: "email",
      },
    });
    for (let key in response.data.properties) {
      if (response.data.properties.hasOwnProperty(key)) {
        // Ensure it is the object's own property
        console.log(key + ": " + response.data.properties[key]);
      }
    }
    console.log("Returning: " + (Object.keys(response.data.properties).length > 0 ? response.data.properties : null));
    return Object.keys(response.data.properties).length > 0 ? response.data.properties : null;
    //return response.data.properties;
  } catch (error) {
    console.error("Error fetching user data from HubSpot:", error);
    throw error;
  }
};
