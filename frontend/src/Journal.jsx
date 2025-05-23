import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const serverUrl = "http://localhost:3000";

export default function Journal({ user }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);
  const [comment, setComment] = useState("");

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.day(); // 0=Sun, 6=Sat
  const daysInMonth = currentMonth.daysInMonth();

  const [dishMap, setDishMap] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchDailyDishes = async () => {
    const token = window.localStorage.getItem("token");

    try {
      const { data } = await axios.get(
        `${API_URL}/journal/${startOfMonth.toISOString()}/${endOfMonth.toISOString()}`,
        {
          headers: { authorization: token },
        }
      );

      if (data) {
        const newDishMap = {};

        data.forEach((d) => {
          const dailyDishDate = d.date;

          const key = dayjs(dailyDishDate).format("YYYY-MM-DD");
          newDishMap[key] = d;
        });
        setDishMap(newDishMap);
        // console.log(newDishMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const today = dayjs();
  const calendarDays = [];

  // Fill calendar cells
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    } else {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
    setSelectedDay(null);
    setComment("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    const token = window.localStorage.getItem("token");

    const dishInfo =
      dishMap[dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")];

    if (!dishInfo) {
      setSelectedDay(null);
      setComment(null);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post(`${API_URL}/journal/${dishInfo.id}`, formData, {
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchDailyDishes();
      setSelectedDay(null);
      setComment(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.log("Error when saving comment");
    }
  };

  useEffect(() => {
    fetchDailyDishes();
  }, [currentMonth]);

  useEffect(() => {
    setComment(
      dishMap[dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")]
        ?.journal?.notes
    );
  }, [selectedDay]);

  return (
    <Box p={3} maxWidth="1600px" mx="auto">
      {/* Month Header with Navigation */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button onClick={() => handleMonthChange("prev")}>← Prev</Button>
        <Typography variant="h4" align="center">
          {currentMonth.format("MMMM YYYY")}
        </Typography>
        <Button onClick={() => handleMonthChange("next")}>Next →</Button>
      </Box>

      {/* Days of Week Header */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        mb={1}
        textAlign="center"
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Typography key={day} variant="subtitle2">
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={1}
        textAlign="center"
      >
        {calendarDays.map((day, idx) => {
          const dateKey =
            day && dayjs(currentMonth).date(day).format("YYYY-MM-DD");
          const dishExists = dateKey && dishMap[dateKey];
          const isToday =
            day &&
            currentMonth.month() === today.month() &&
            currentMonth.year() === today.year() &&
            day === today.date();

          return (
            <Paper
              key={idx}
              elevation={2}
              sx={{
                height: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
                backgroundColor: day
                  ? isToday
                    ? "#ffd700"
                    : dishExists
                    ? "#fff"
                    : "#f0f0f0" // gray out days with no dish
                  : "transparent",
                color: dishExists ? "inherit" : "gray", // gray text if no dish
                cursor: dishExists ? "pointer" : "default",
              }}
              onClick={() => {
                if (day && dishExists) {
                  setSelectedDay(day);
                }
              }}
            >
              {day && (
                <Box>
                  <Typography>{day}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dishExists ? dishMap[dateKey].recipe.title : ""}
                  </Typography>
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

      <Modal
        open={!!selectedDay}
        onClose={() => {
          setSelectedDay(null);
          setComment("");
          setImageFile(null);
          setImagePreview(null);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(1px)",
        }}
      >
        <Box
          sx={{
            bgcolor: "#eee2dc",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
            padding: "20px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "8px",
          }}
        >
          {selectedDay && (
            <>
              <Typography variant="h6" textAlign="center" gutterBottom>
                {currentMonth.format("MMMM")} {selectedDay},{" "}
                {currentMonth.year()}
              </Typography>

              <Typography>
                Recipe Name:{" "}
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.title && (
                  <span>
                    {
                      dishMap[
                        dayjs(currentMonth)
                          .date(selectedDay)
                          .format("YYYY-MM-DD")
                      ]?.recipe.title
                    }
                  </span>
                )}
              </Typography>

              <Typography variant="body2" gutterBottom>
                Ready in{" "}
                {
                  dishMap[
                    dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                  ]?.recipe?.readyInMinutes
                }{" "}
                minutes | Serves{" "}
                {
                  dishMap[
                    dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                  ]?.recipe?.servings
                }
              </Typography>

              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" mb={1}>
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.vegetarian && (
                  <Chip label="Vegetarian" color="success" />
                )}
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.vegan && <Chip label="Vegan" color="success" />}
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.glutenFree && (
                  <Chip label="Gluten Free" color="info" />
                )}
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.dairyFree && (
                  <Chip label="Dairy Free" color="info" />
                )}
              </Stack>

              <Typography variant="subtitle1">Ingredients</Typography>
              <List dense>
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.ingredients.map((ing, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemText primary={`• ${ing}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1">Instructions</Typography>
              <List dense>
                {dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.recipe?.instructions.map((ins, index) => (
                  <ListItem
                    key={index}
                    sx={{ alignItems: "flex-start", py: 0.5 }}
                  >
                    <ListItemText primary={`${index + 1}. ${ins}`} />
                  </ListItem>
                ))}
              </List>
              <Link
                href={
                  dishMap[
                    dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                  ]?.recipe?.sourceUrl
                }
              >
                Recipe Source
              </Link>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment on the dish"
                variant="outlined"
                value={comment}
                sx={{ mb: 2, mt: 3 }}
                onChange={(e) => setComment(e.target.value)}
              />

              <input type="file" accept="image/" onChange={handleImageChange} />
              {imagePreview ? (
                <Box mt={2}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              ) : (
                // Show saved image from database if no new file is uploaded
                dishMap[
                  dayjs(currentMonth).date(selectedDay).format("YYYY-MM-DD")
                ]?.journal?.imageUrl && (
                  <Box mt={2}>
                    <Typography>Uploaded photo of completed dish:</Typography>
                    <img
                      src={
                        serverUrl +
                        "/" +
                        dishMap[
                          dayjs(currentMonth)
                            .date(selectedDay)
                            .format("YYYY-MM-DD")
                        ]?.journal.imageUrl
                      }
                      alt="Saved Dish"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                )
              )}

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
