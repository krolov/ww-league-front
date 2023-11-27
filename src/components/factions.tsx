import {useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Grid, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import qs from "query-string";

const columns: GridColDef[] = [
  {field: "name", headerName: "Faction Name", width: 250},
  {
    field: "winRate",
    headerName: "Win Rate",
    type: "number",
    width: 150,
  },
  {
    field: "games",
    headerName: "Games",
    type: "number",
    width: 150,
  },
  {
    field: "points",
    headerName: "League Points",
    type: "number",
    width: 150,
  },
];

export const Factions = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<
    {
      name: string;
      winRate: number;
      games: number;
      points: string;
    }[]
  >([]);
  const [season, setSeason] = useState("All");
  const [map, setMap] = useState("All");
  const [turnOrder, setTurnOrder] = useState("All");

  useEffect(() => {
    const query = qs.stringify({
      season: season === "All" ? undefined : season,
      map: map === "All" ? undefined : map,
      turnOrder: turnOrder === "All" ? undefined : turnOrder,
    });
    fetch(`http://localhost:3000/league/factions?${query}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(
            result.map((item: any, index: number) => ({...item, id: index}))
          );
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [season, map, turnOrder]);

  const handleSeason = (_: React.MouseEvent, newSeason: string) => {
    if (newSeason !== null) {
      setSeason(newSeason);
    }
  };

  const handleMap = (_: React.MouseEvent, newMap: string) => {
    if (newMap !== null) {
      setMap(newMap);
    }
  };
  const handleTurnOrder = (_: React.MouseEvent, newTurnOrder: string) => {
    if (newTurnOrder !== null) {
      setTurnOrder(newTurnOrder);
    }
  };

  console.log(turnOrder);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <Grid container spacing={2} sx={{marginBottom: 2}}>
          <Grid item>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Season
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={season}
              exclusive
              onChange={handleSeason}
              aria-label="Platform"
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="1">S01</ToggleButton>
              <ToggleButton value="2">S02</ToggleButton>
              <ToggleButton value="3">S03</ToggleButton>
              <ToggleButton value="4">S04</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Map
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={map}
              exclusive
              onChange={handleMap}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Autumn">Autumn</ToggleButton>
              <ToggleButton value="Winter">Winter</ToggleButton>
              <ToggleButton value="Lake">Lake</ToggleButton>
              <ToggleButton value="Mountain">Mountain</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Turn Order
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={turnOrder}
              exclusive
              onChange={handleTurnOrder}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="1">Turn 1</ToggleButton>
              <ToggleButton value="2">Turn 2</ToggleButton>
              <ToggleButton value="3">Turn 3</ToggleButton>
              <ToggleButton value="4">Turn 4</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <DataGrid rows={items} columns={columns} />;
      </div>
    );
  }
};
