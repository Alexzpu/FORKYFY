import { async } from "regenerator-runtime";
import { TIMEUOT_SEC } from "./config.js";


const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const getJSON = async function(url) {
    try{
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEUOT_SEC)]);
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }catch (error) {
        throw error;
    }; 
};

export const sendJSON = async function(url, uplodeData) {
  try{
      const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Tipe': 'Application/json'
        },
        body: JSON.stringify(uplodeData)
      });
      const res = await Promise.race([fetchPro, timeout(TIMEUOT_SEC)]);
      const data = await res.json();

      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  }catch (error) {
      throw error;
  }; 
};