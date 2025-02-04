import React from "react";
import { getUserInfo } from "../api/user";

import {
  Slider,
  Typography,
  Select,
  MenuItem,
  Stack,
  FormGroup,
  FormControlLabel,
  Switch,
  Checkbox,
  Button,
} from "@mui/material";
import "./FilterBar.css";

const attributes = [
  "GenreIsNonGame",
  "GenreIsIndie",
  "GenreIsAction",
  "GenreIsAdventure",
  "GenreIsCasual",
  "GenreIsStrategy",
  "GenreIsRPG",
  "GenreIsSimulation",
  "GenreIsEarlyAccess",
  "GenreIsFreeToPlay",
  "GenreIsSports",
  "GenreIsRacing",
  "GenreIsMassivelyMultiplayer",
  "CategoryMMO",
  "CategoryCoop",
  "CategoryVRSupport",
  "ControllerSupport",
  "CategorySinglePlayer",
  "CategoryMultiplayer",
  "CategoryInAppPurchase",
  "CategoryIncludeLevelEditor",
];

function FilterBar({
  loggedIn,
  username,
  tags,
  setTags,
  yearRange,
  setYearRange,
  mac,
  setMac,
  windows,
  setWindows,
  linux,
  setLinux,
  priceRange,
  setPriceRange,
  requiredAge,
  setRequiredAge,
  metaCriticRange,
  setMetaCriticRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const handleUserPreferencesClick = async () => {
    try {
      const results = await getUserInfo(username);
      const userInfo = results.data;
      setRequiredAge(userInfo.Age);
      setMac(userInfo.OwnsMac);
      setWindows(userInfo.OwnsWindows);
      setLinux(userInfo.OwnsLinux);
      setTags(userInfo.FavoriteGenres.split(","));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSliderChange = (
    event,
    newValue,
    activeThumb,
    value,
    setValue,
    minDistance
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <div className="filter-bar-container">
      <h2>Advanced Search</h2>
      <Typography id="tags-checkbox" gutterBottom>
        <b>Tags</b>
      </Typography>
      <div className="tag-container">
        {attributes.map((attribute) => {
          return (
            <FormControlLabel
              key={attribute}
              control={
                <Checkbox
                  checked={tags.includes(attribute)}
                  onChange={({ target }) => {
                    if (target.checked && !tags.includes(attribute)) {
                      setTags([...tags, attribute]);
                    } else if (!target.checked && tags.includes(attribute)) {
                      setTags(tags.filter((tag) => tag !== attribute));
                    }
                  }}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: 10 }}>
                  {attribute.replace("GenreIs", "").replace("Category", "")}
                </Typography>
              }
            />
          );
        })}
      </div>
      <Typography id="platform-switch" gutterBottom>
        <b>Platform</b>
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={!!mac}
              onChange={({ target }) => setMac(Number(target.checked))}
            />
          }
          label="Mac"
        />
        <FormControlLabel
          control={
            <Switch
              checked={!!windows}
              onChange={({ target }) => setWindows(Number(target.checked))}
            />
          }
          label="Windows"
        />
        <FormControlLabel
          control={
            <Switch
              checked={!!linux}
              onChange={({ target }) => setLinux(Number(target.checked))}
            />
          }
          label="Linux"
        />
      </FormGroup>

      <Typography id="requiredage-slider" gutterBottom>
        <b>Minimum Required Age</b>
      </Typography>
      <Slider
        value={requiredAge}
        onChange={(e, newValue) => setRequiredAge(newValue)}
        valueLabelDisplay="auto"
        min={8}
        max={21}
      />

      <Typography id="year-slider" gutterBottom>
        <b>Release Year</b>
      </Typography>
      <Slider
        value={yearRange}
        onChange={(event, newValue, activeThumb) =>
          handleSliderChange(
            event,
            newValue,
            activeThumb,
            yearRange,
            setYearRange,
            5
          )
        }
        valueLabelDisplay="auto"
        disableSwap
        min={1950}
        max={2023}
      />

      <Typography id="price-slider" gutterBottom>
        <b>Price (USD)</b>
      </Typography>
      <Slider
        value={priceRange}
        onChange={(event, newValue, activeThumb) =>
          handleSliderChange(
            event,
            newValue,
            activeThumb,
            priceRange,
            setPriceRange,
            5
          )
        }
        valueLabelDisplay="auto"
        disableSwap
        min={0}
        max={150}
      />

      <Typography id="metacritic-slider" gutterBottom>
        <b>MetaCritic Score</b>
      </Typography>
      <Slider
        value={metaCriticRange}
        onChange={(event, newValue, activeThumb) =>
          handleSliderChange(
            event,
            newValue,
            activeThumb,
            metaCriticRange,
            setMetaCriticRange,
            5
          )
        }
        valueLabelDisplay="auto"
        disableSwap
        min={0}
        max={100}
      />

      <Typography id="sort" gutterBottom>
        <b>Sort By:</b>
      </Typography>
      <Stack direction="row" spacing={2}>
        <Select
          id="sort-by-select"
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value)}
          variant="standard"
          style={{
            color: "white",
          }}
        >
          <MenuItem value={"MetaCritic"}>MetaCritic</MenuItem>
          <MenuItem value={"ReleaseDate"}>Release Date</MenuItem>
          <MenuItem value={"GameName"}>Title</MenuItem>
          <MenuItem value={"Price"}>Price</MenuItem>
          <MenuItem value={"PlayerEstimate"}>Player Count</MenuItem>
        </Select>
        <Select
          id="sort-order-select"
          value={sortOrder}
          label="Sort Order"
          onChange={(e) => setSortOrder(e.target.value)}
          variant="standard"
          style={{
            color: "white",
          }}
        >
          <MenuItem value={"ASC"}>Ascending</MenuItem>
          <MenuItem value={"DESC"}>Descending</MenuItem>
        </Select>
      </Stack>
      {loggedIn && (
        <Button
          variant="contained"
          onClick={handleUserPreferencesClick}
          style={{
            color: "white",
            marginTop: "1rem",
          }}
          disabled={!loggedIn}
        >
          Fill User Preferences
        </Button>
      )}
    </div>
  );
}

export default FilterBar;
