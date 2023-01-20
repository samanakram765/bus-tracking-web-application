import { useState } from "react";

export const usePromise = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const requestPromise = async (...args) => {
    setLoading(true);
    try {
      const result = await Promise.all([...args]);
      setData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return {
    data,
    loading,
    requestPromise,
  };
};
