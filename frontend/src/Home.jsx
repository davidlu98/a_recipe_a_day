import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Link,
  Skeleton,
} from "@mui/material";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home({ user }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const didFetch = useRef(false);

  const fetchDailyRecipe = async () => {
    const token = window.localStorage.getItem("token");

    try {
      const { data } = await axios.get(`${API_URL}/spoonacular/daily`, {
        headers: { authorization: token },
      });

      // console.log(data.recipe);

      setRecipe(data.recipe);
    } catch (error) {
      console.log("Failed to fetch recipe", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      fetchDailyRecipe();
      didFetch.current = true;
    }
  }, []);

  if (!user) {
    return <Typography>Please log in</Typography>;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ maxWidth: 800, magin: "auto", mt: 4 }}>
        <CardMedia
          component="img"
          height="500"
          image={recipe.image}
          alt={recipe.title}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {recipe.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Ready in {recipe.readyInMinutes} minutes | Serves {recipe.servings}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" mb={1}>
            {recipe.vegetarian && <Chip label="Vegetarian" color="success" />}
            {recipe.vegan && <Chip label="Vegan" color="success" />}
            {recipe.glutenFree && <Chip label="Gluten Free" color="info" />}
            {recipe.dairyFree && <Chip label="Dairy Free" color="info" />}
          </Stack>
          <Typography variant="subtitle1">Ingredients</Typography>
          <List dense>
            {recipe.ingredients.map((ing, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText primary={`• ${ing}`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1">Instructions</Typography>
          <List dense>
            {recipe.instructions.map((ins, index) => (
              <ListItem key={index} sx={{ alignItems: "flex-start", py: 0.5 }}>
                <ListItemText primary={`${index + 1}. ${ins}`} />
              </ListItem>
            ))}
          </List>
          <Link href={recipe.sourceUrl}>Recipe Source</Link>
        </CardContent>
      </Card>
    </Box>
  );
}
