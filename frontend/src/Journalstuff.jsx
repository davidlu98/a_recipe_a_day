const fetchDailyDishes = async () => {
  const token = window.localStorage.getItem("token");

  try {
    const { data } = await axios.get(`${API_URL}/journal/`, {
      headers: { authorization: token },
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchDailyDishes();
}, []);
